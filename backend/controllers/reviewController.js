const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const PhotographerProfile = require("../models/PhotographerProfile");

const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) { res.status(404); throw new Error("Booking not found"); }
  if (booking.customer.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  if (booking.status !== "completed") { res.status(400); throw new Error("Can only review completed bookings"); }
  if (await Review.findOne({ booking: bookingId })) { res.status(400); throw new Error("Review already submitted"); }

  const review = await Review.create({ booking: bookingId, customer: req.user._id, photographer: booking.photographer, rating, comment });
  const all = await Review.find({ photographer: booking.photographer });
  const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
  await PhotographerProfile.findOneAndUpdate({ user: booking.photographer }, { averageRating: parseFloat(avg.toFixed(1)), totalReviews: all.length });
  res.status(201).json(review);
});

const getPhotographerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ photographer: req.params.photographerId })
    .populate("customer", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

module.exports = { createReview, getPhotographerReviews };
