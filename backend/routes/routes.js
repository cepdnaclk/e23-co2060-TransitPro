const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Route = require("../models/Route");
const Vehicle = require("../models/Vehicle");

router.get("/", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();

    const recentBookings = await Booking.find()
      .limit(5)
      .sort({ createdAt: -1 })
      .populate("vehicle")
      .populate("route");

    const vehicleUsage = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicle",
          foreignField: "_id",
          as: "vehicleData"
        }
      },
      { $unwind: "$vehicleData" },
      {
        $group: {
          _id: "$vehicleData.type",
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          type: "$_id",
          value: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalBookings,
      totalRoutes,
      totalVehicles,
      recentBookings,
      vehicleUsage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
