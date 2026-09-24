const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Route = require("../models/Route");
const { normalizePhone, isValidSriLankanPhone } = require("../utils_phone");

const ACTIVE_STATUSES = ["Pending", "Approved", "Completed"];
const MANIFEST_STATUSES = ["Approved", "Completed"];

const populateBooking = (query) =>
  query.populate("route").populate("vehicle");

const normalizeSeats = (seatNumbers) => {
  if (!Array.isArray(seatNumbers)) return [];
  return [...new Set(seatNumbers.map(Number).filter(Number.isInteger))];
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await populateBooking(Booking.find().sort({ createdAt: -1 }));
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await populateBooking(
      Booking.find({ contact: normalizePhone(req.params.contact) }).sort({ createdAt: -1 })
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookedSeats = async (req, res) => {
  try {
    const { routeId, date } = req.params;
    if (!mongoose.isValidObjectId(routeId)) {
      return res.status(400).json({ error: "Invalid route ID" });
    }
    if (!date) return res.status(400).json({ error: "Travel date is required" });

    const bookings = await Booking.find({
      route: routeId,
      date,
      status: { $in: ACTIVE_STATUSES },
    }).select("seatNumbers seats gender");

    const seatGender = {};
    bookings.forEach((booking) => {
      const gender = booking.gender === "Female" ? "Female" : booking.gender === "Male" ? "Male" : null;
      const seats = booking.seatNumbers?.length
        ? booking.seatNumbers.map(Number)
        : [];

      seats.forEach((seat) => {
        if (Number.isInteger(seat)) {
          seatGender[String(seat)] = gender;
        }
      });
    });

    const bookedSeats = Object.keys(seatGender)
      .map(Number)
      .filter(Number.isInteger)
      .sort((a, b) => a - b);

    res.json({ bookedSeats, seatGender });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBooking = async (req, res) => {
  try {
    const {
      customerName,
      gender = "",
      contact = "",
      route,
      vehicle,
      date,
      pickupLocation = "",
      bookingType = "Trip",
      status = "Pending",
    } = req.body;

    if (!customerName?.trim()) {
      return res.status(400).json({ error: "Customer name is required." });
    }
    if (bookingType === "Trip" && !["Male", "Female"].includes(gender)) {
      return res.status(400).json({ error: "Please select passenger gender: Male or Female." });
    }
    const normalizedContact = normalizePhone(contact);
    if (!isValidSriLankanPhone(contact)) {
      return res.status(400).json({ error: "Please enter a valid Sri Lankan phone number with exactly 10 digits (e.g. 0712345678)." });
    }
    if (!date) return res.status(400).json({ error: "Travel date is required." });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
      return res.status(400).json({ error: "Please provide a valid travel date." });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      return res.status(400).json({ error: "Travel date cannot be in the past." });
    }
    const pickup = String(pickupLocation || "").trim();
    if (!pickup) {
      return res.status(400).json({ error: "Pickup location is required." });
    }
    if (!mongoose.isValidObjectId(route) && bookingType === "Trip") {
      return res.status(400).json({ error: "Please select a valid route." });
    }

    const seatNumbers = normalizeSeats(req.body.seatNumbers);
    const seats = Number(req.body.seats || seatNumbers.length);

    if (!Number.isInteger(seats) || seats < 1) {
      return res.status(400).json({ error: "Please select at least one seat." });
    }

    if (bookingType === "Trip" && seatNumbers.length !== seats) {
      return res.status(400).json({
        error: "The number of selected seats does not match the booking quantity.",
      });
    }

    if (seatNumbers.some((seat) => seat < 1)) {
      return res.status(400).json({ error: "Seat numbers must be positive." });
    }

    const selectedRoute = await Route.findById(route).populate("vehicle");
    if (!selectedRoute) {
      return res.status(404).json({ error: "Selected route was not found." });
    }

    const selectedVehicle = selectedRoute.vehicle || null;
    if (bookingType === "Trip" && selectedVehicle?.seats) {
      if (seatNumbers.some((seat) => seat > selectedVehicle.seats)) {
        return res.status(400).json({
          error: `This vehicle only has ${selectedVehicle.seats} seats.`,
        });
      }
    }

    if (bookingType === "Trip") {
      const existing = await Booking.find({
        route,
        date,
        status: { $in: ACTIVE_STATUSES },
      }).select("seatNumbers");

      const alreadyBooked = new Set(
        existing.flatMap((b) => (b.seatNumbers || []).map(Number))
      );
      const conflict = seatNumbers.filter((seat) => alreadyBooked.has(seat));

      if (conflict.length) {
        return res.status(409).json({
          error: `Seat(s) ${conflict.join(", ")} are already booked. Please choose different seats.`,
        });
      }
    }

    const booking = await Booking.create({
      customerName: customerName.trim(),
      gender: bookingType === "Trip" ? gender : null,
      contact: normalizedContact,
      route,
      vehicle: vehicle || selectedVehicle?._id || null,
      date,
      seats,
      seatNumbers,
      pickupLocation: pickup,
      bookingType,
      status,
    });

    const populated = await populateBooking(Booking.findById(booking._id));
    res.status(201).json(populated);
  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A booking reference collision occurred. Please try again.",
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || "Unable to create booking." });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const oldStatus = booking.status;
    Object.assign(booking, req.body);

    if (req.body.status && req.body.status !== oldStatus) {
      booking.statusHistory.push({
        status: req.body.status,
        note: `Status changed from ${oldStatus} to ${req.body.status}`,
      });
    }

    await booking.save();
    const populated = await populateBooking(Booking.findById(booking._id));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const allowed = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];
  if (!allowed.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid booking status." });
  }
  req.body = { status: req.body.status };
  return exports.updateBooking(req, res);
};

exports.deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getManifest = async (req, res) => {
  try {
    const { routeId, date, includePending } = req.query;
    const filter = {
      bookingType: "Trip",
      status: { $in: includePending === "true" ? ACTIVE_STATUSES : MANIFEST_STATUSES },
    };
    if (routeId) {
      if (!mongoose.isValidObjectId(routeId)) {
        return res.status(400).json({ error: "Invalid route ID" });
      }
      filter.route = routeId;
    }
    if (date) filter.date = date;

    const bookings = await populateBooking(
      Booking.find(filter).sort({ createdAt: 1 })
    );

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
