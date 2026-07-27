const express = require("express");
const b = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");
b.post("/", protect, authorize("customer"), createBooking);
b.get("/mine", protect, getMyBookings);
b.put("/:id/status", protect, updateBookingStatus);
module.exports = b;
