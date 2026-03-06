require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User').default;
const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');

const run = async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/transportdb');
  await User.deleteMany({});
  await Route.deleteMany({});
  await Vehicle.deleteMany({});

  const adminPass = await bcrypt.hash('Admin@123', 10);
  const userPass = await bcrypt.hash('User@123', 10);

  const admin = new User({ name: 'Admin', email: 'admin@example.com', password: adminPass, role: 'admin' });
  const user = new User({ name: 'User', email: 'user@example.com', password: userPass, role: 'user' });
  await admin.save();
  await user.save();

  const r1 = new Route({ from: 'Kandy', to: 'Colombo', price: 350, duration: '3h' });
  const r2 = new Route({ from: 'Galle', to: 'Colombo', price: 400, duration: '3.5h' });
  await r1.save(); await r2.save();

  const v1 = new Vehicle({ type: 'Van', number: 'SL-1234', seats: 12, pricePerDay: 5000 });
  const v2 = new Vehicle({ type: 'Car', number: 'SL-9876', seats: 4, pricePerDay: 3000 });
  await v1.save(); await v2.save();

  console.log('Seeded. Admin: admin@example.com / Admin@123');
  process.exit(0);
};

run();
