const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Route = require("../models/Route");
const Vehicle = require("../models/Vehicle");

router.get("/", async (req, res) => {
  try {
    // ================= KPI COUNTS =================
    const totalBookings = await Booking.countDocuments();
    const totalRoutes = await Route.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();

    const pendingBookings = await Booking.countDocuments({ status: "Pending" });
    const approvedBookings = await Booking.countDocuments({ status: "Approved" });
    const rejectedBookings = await Booking.countDocuments({ status: "Rejected" });

    // ================= RECENT BOOKINGS =================
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("route")
      .populate("vehicle");

    // ================= WEEKLY BOOKINGS =================
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));

      const count = await Booking.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      last7.push({
        day: start.toLocaleDateString("en-US", { weekday: "short" }),
        bookings: count
      });
    }

    // ================= BOOKING TYPE PIE =================
    const tripCount = await Booking.countDocuments({ bookingType: "Trip" });
    const rentalCount = await Booking.countDocuments({ bookingType: "Rental" });

    const bookingTypeData = [
      { name: "Trip", value: tripCount },
      { name: "Rental", value: rentalCount }
    ];

    // ================= STATUS PIE =================
    const statusData = [
      { name: "Pending", value: pendingBookings },
      { name: "Approved", value: approvedBookings },
      { name: "Rejected", value: rejectedBookings }
    ];

    // ================= TOP ROUTES BAR =================
    const topDemandRoutesRaw = await Booking.aggregate([
      { $match: { route: { $ne: null } } },
      {
        $group: {
          _id: "$route",
          bookings: { $sum: 1 }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "routes",
          localField: "_id",
          foreignField: "_id",
          as: "routeData"
        }
      },
      { $unwind: "$routeData" },
      {
        $project: {
          _id: 0,
          route: {
            $concat: ["$routeData.from", " → ", "$routeData.to"]
          },
          bookings: 1
        }
      }
    ]);

    // fallback if no route bookings
    const topDemandRoutes = topDemandRoutesRaw.length
      ? topDemandRoutesRaw
      : [{ route: "No Route Data", bookings: 0 }];

    // ================= RESPONSE =================
    res.json({
      totalVehicles,
      totalRoutes,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      weeklyBookings: last7,
      bookingTypeData,
      statusData,
      topDemandRoutes,
      recentBookings
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;