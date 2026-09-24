const Route = require("../models/Route");

// ===============================
// Get all routes
// ===============================
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// Get single route by ID
// ===============================
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("vehicle");

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// Add new route
// ===============================
exports.addRoute = async (req, res) => {
  try {
    const { from, to, price, departureTime, arrivalTime, vehicle } = req.body;

    if (!from || !to || !price) {
      return res.status(400).json({ error: "Please fill route details" });
    }

    const route = await Route.create({
      from,
      to,
      price,
      departureTime,
      arrivalTime,
      vehicle,
    });

    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// Update route
// ===============================
exports.updateRoute = async (req, res) => {
  try {
    const updated = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// Delete route
// ===============================
exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Vehicle = require("../models/Vehicle");

exports.getHomepageStats = async (req, res) => {
  try {
    const routes = await Route.find().populate("vehicle");
    const vehicles = await Vehicle.find();

    const activeSchedules = routes.slice(0, 4);

    res.json({
      totalRoutes: routes.length,
      totalVehicles: vehicles.length,
      schedules: activeSchedules,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};