const router = require("express").Router();
const Vehicle = require("../models/Vehicle");

router.post("/", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
});

module.exports = router;
