const router = require("express").Router();
const User = require("../models/User");

// Register admin (run only once)
router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    await user.save();
    res.json({ message: "User created!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const user = await User.findOne({ username: req.body.username });

  console.log("FOUND USER:", user);

  if (!user)
    return res.status(400).json({ message: "User not found" });

  if (user.password !== req.body.password)
    return res.status(400).json({ message: "Wrong password" });

  res.json({ message: "Login success", redirect: "/admin" });
});

module.exports = router;
