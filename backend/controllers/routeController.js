const Route = require("../models/Route");

// Get all routes
exports.getRoutes = async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
};

// Add new route
exports.addRoute = async (req, res) => {
  const newRoute = new Route(req.body);
  await newRoute.save();
  res.json({ message: "Route added!" });
};

// Update route
exports.updateRoute = async (req, res) => {
  const updated = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

// Delete route
exports.deleteRoute = async (req, res) => {
  await Route.findByIdAndDelete(req.params.id);
  res.json({ message: "Route deleted!" });
};

exports.getRecentBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("vehicle");
  
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ error: "Failed to load recent bookings" });
    }
};

exports.getRouteById = async (req, res) => {
    try {
      const route = await Route.findById(req.params.id);
  
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
  
      res.json(route);
    } catch (err) {
      res.status(500).json({ message: "Invalid route ID" });
    }
};
  
  

