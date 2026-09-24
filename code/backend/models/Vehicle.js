const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    seats: Number,
    comfort: String,
    rentPrice: Number,
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);