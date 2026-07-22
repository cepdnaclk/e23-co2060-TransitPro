const Booking = require("../models/Booking");

// ==========================================
// BOOKING CONTROLLERS
// ==========================================

/**
 * @desc    Fetch all bookings with populated Route and Vehicle data
 * @route   GET /api/bookings
 */
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("route")
      .populate("vehicle");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Create a new booking record
 * @route   POST /api/bookings
 */
exports.addBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error adding booking:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Update an existing booking by ID
 * @route   PUT /api/bookings/:id
 */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Returns the updated document and enforces schema validation
    );

    // Return a 404 if the requested booking ID doesn't exist
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Delete a booking by ID
 * @route   DELETE /api/bookings/:id
 */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    // Return a 404 if no record matches the provided ID
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ error: error.message });
  }
};
