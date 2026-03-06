const Booking = require("../models/Booking");

exports.getBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("route")
        .populate("vehicle");
  
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  

exports.addBooking = async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
};

exports.updateBooking = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(booking);
};

exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking deleted" });
};
