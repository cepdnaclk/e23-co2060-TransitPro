const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");

    // ✅ ONLY START SERVER AFTER DB CONNECTS
    app.use("/api/auth", require("./routes/auth")); 
    app.use("/api/bookings", require("./routes/bookings"));
    app.use("/api/dashboard", require("./routes/dashboard"));
    app.use("/api/routes", require("./routes/routes"));
    app.use("/api/vehicles", require("./routes/vehicles"));

    app.listen(5001, () => {
      console.log("Server started on 5001");
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });
