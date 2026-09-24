const router = require("express").Router();
const {
  getBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  updateBookingStatus,
  getBookedSeats,
  getManifest,
} = require("../controllers/bookingController");

router.get("/manifest", getManifest);
router.get("/user/:contact", getUserBookings);
router.get("/seats/:routeId/:date", getBookedSeats);
router.get("/", getBookings);
router.post("/", addBooking);
router.put("/:id", updateBooking);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

module.exports = router;
