require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);

if (!process.env.MONGO_URL) {
  console.error("MONGO_URL is missing. Create code/backend/.env from .env.example");
  process.exit(1);
}

console.log("Connecting to MongoDB...");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", service: "TransitPRO API" });
    });

    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/bookings", require("./routes/bookings"));
    app.use("/api/dashboard", require("./routes/dashboard"));
    app.use("/api/routes", require("./routes/routes"));
    app.use("/api/vehicles", require("./routes/vehicles"));

    app.use((req, res) => {
      res.status(404).json({ error: "API endpoint not found" });
    });

    app.listen(PORT, () => {
      console.log(`TransitPRO API running on http://localhost:${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌:");
    console.error(err.message);
    process.exit(1);
  });
