const Admin = require("../models/Admin");

// TEMP: No password hashing yet (we add hashing later)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) return res.status(400).json({ error: "User not found" });

  if (admin.password !== password)
    return res.status(400).json({ error: "Incorrect password" });

  res.json({ message: "Login successful" });
};
