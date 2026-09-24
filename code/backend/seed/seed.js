require("dotenv").config();
const mongoose = require("mongoose");
const Route = require("../models/Route");
const Vehicle = require("../models/Vehicle");
const Admin = require("../models/Admin");

const run = async () => {
  if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required");
  await mongoose.connect(process.env.MONGO_URL);

  await Route.deleteMany({});
  await Vehicle.deleteMany({});

  const vehicles = await Vehicle.insertMany([
    { name: "TransitPRO Express", type: "Bus", seats: 40, comfort: "AC", rentPrice: 9000, available: true },
    { name: "Campus Van", type: "Van", seats: 12, comfort: "Non-AC", rentPrice: 5000, available: true },
    { name: "Executive Car", type: "Car", seats: 4, comfort: "AC", rentPrice: 4000, available: true },
  ]);

  await Route.insertMany([
    { from: "Kandy", to: "Peradeniya", price: 120, departureTime: "07:30", arrivalTime: "08:00", vehicle: vehicles[0]._id },
    { from: "Peradeniya", to: "Kandy", price: 120, departureTime: "16:30", arrivalTime: "17:00", vehicle: vehicles[0]._id },
    { from: "Kandy", to: "Colombo", price: 350, departureTime: "06:00", arrivalTime: "09:30", vehicle: vehicles[0]._id },
  ]);

  const existingAdmin = await Admin.findOne({ username: "admin" });
  if (!existingAdmin) await Admin.create({ username: "admin", password: "1234" });

  console.log("TransitPRO demo data seeded.");
  await mongoose.disconnect();
};

run().catch(async (err) => { console.error(err); await mongoose.disconnect(); process.exit(1); });
