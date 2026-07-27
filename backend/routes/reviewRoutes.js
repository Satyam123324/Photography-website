const express = require("express");
const r = express.Router();
const { createReview, getPhotographerReviews } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");
r.post("/", protect, authorize("customer"), createReview);
r.get("/:photographerId", getPhotographerReviews);
module.exports = r;
