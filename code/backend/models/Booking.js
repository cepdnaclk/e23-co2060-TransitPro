const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: { type: String, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female"], default: null },
    contact: { type: String, default: "", trim: true, match: /^(|0\d{9})$/ },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    date: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
    seatNumbers: { type: [Number], default: [] },
    pickupLocation: { type: String, default: "", trim: true },
    bookingType: { type: String, enum: ["Trip", "Rental"], default: "Trip" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true }
);

bookingSchema.pre("save", function () {
  if (!this.bookingReference) {
    const stamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    this.bookingReference = `TRP-${stamp}-${random}`;
  }

  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [
      { status: this.status, note: "Booking created" },
    ];
  }

});

module.exports = mongoose.model("Booking", bookingSchema);
