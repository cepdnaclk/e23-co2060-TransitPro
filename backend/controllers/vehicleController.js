const Vehicle = require("../models/Vehicle");

// Add vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { type, number, seats } = req.body;

    // Backend validation
    if (!type || !number || !seats) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    if (Number(seats) <= 0) {
      return res
        .status(400)
        .json({ error: "Seats must be greater than 0" });
    }

    // Prevent duplicate vehicle numbers
    const exists = await Vehicle.findOne({ number });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Vehicle number already exists!" });
    }

    const vehicle = await Vehicle.create({ type, number, seats });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { type, number, seats } = req.body;

    if (!type || !number || !seats) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const updated = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { type, number, seats },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
