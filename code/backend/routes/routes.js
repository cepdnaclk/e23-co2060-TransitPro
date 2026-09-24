const express = require("express");
const router = express.Router();

const {
  getRoutes,
  getRouteById,
  addRoute,
  updateRoute,
  deleteRoute,
  getHomepageStats,
} = require("../controllers/routeController");


// homepage stats route MUST come before /:id
router.get("/homepage/stats", getHomepageStats);

router.get("/", getRoutes);
router.get("/:id", getRouteById);
router.post("/", addRoute);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

module.exports = router;