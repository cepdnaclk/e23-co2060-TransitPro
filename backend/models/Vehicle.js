const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    number: { type: String, required: true },
    seats: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
