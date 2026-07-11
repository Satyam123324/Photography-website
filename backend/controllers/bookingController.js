const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");

const createBooking = asyncHandler(async (req, res) => {
  const { photographer, category, eventDate, location, budget, notes } = req.body;
  if (!photographer || !category || !eventDate || !location) { res.status(400); throw new Error("photographer, category, eventDate and location are required"); }
  const booking = await Booking.create({ customer: req.user._id, photographer, category, eventDate, location, budget, notes });
  res.status(201).json(booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "photographer" ? { photographer: req.user._id } : { customer: req.user._id };
  const bookings = await Booking.find(filter)
    .populate("customer", "name email phone avatar")
    .populate("photographer", "name email phone avatar")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) { res.status(404); throw new Error("Booking not found"); }
  const isPhotographer = booking.photographer.toString() === req.user._id.toString();
  const isCustomer = booking.customer.toString() === req.user._id.toString();
  if (!isPhotographer && !(isCustomer && status === "cancelled")) { res.status(403); throw new Error("Not authorized"); }
  booking.status = status;
  res.json(await booking.save());
});

module.exports = { createBooking, getMyBookings, updateBookingStatus };
