const router = require("express").Router();
const Booking = require("../models/Booking");
const Route = require("../models/Route");
const Vehicle = require("../models/Vehicle");

router.get("/", async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalRoutes = await Route.countDocuments();
  const totalVehicles = await Vehicle.countDocuments();

  const recentBookings = await Booking.find()
    .populate("route")
    .populate("vehicle")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalBookings,
    totalRoutes,
    totalVehicles,
    recentBookings
  });
});

module.exports = router;
