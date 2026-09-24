const router = require("express").Router();
const Vehicle = require("../models/Vehicle");

// ================= GET ALL VEHICLES =================
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADD VEHICLE =================
router.post("/", async (req, res) => {
  try {
    const { name, type, seats, comfort, rentPrice } = req.body;

    if (!name || !type || !seats) {
      return res.status(400).json({ error: "Please fill all required vehicle fields" });
    }

    const vehicle = new Vehicle({
      name,
      type,
      seats,
      comfort,
      rentPrice,
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE VEHICLE =================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE VEHICLE =================
router.delete("/:id", async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;