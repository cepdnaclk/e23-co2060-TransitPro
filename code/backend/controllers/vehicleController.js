const Vehicle = require("../models/Vehicle");

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { name, type, seats, comfort, rentPrice } = req.body;

    if (!name || !type || !seats) {
      return res.status(400).json({ error: "Please fill required fields" });
    }

    const vehicle = await Vehicle.create({
      name,
      type,
      seats,
      comfort,
      rentPrice,
      available: true,
    });

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};