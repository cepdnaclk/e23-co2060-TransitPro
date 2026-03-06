const router = require("express").Router();
const {
  getBookings,
  addBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

router.get("/", getBookings);
router.post("/", addBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
