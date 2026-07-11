const express = require("express");
const router = express.Router();
const { createReview, getPhotographerReviews } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("customer"), createReview);
router.get("/:photographerId", getPhotographerReviews);
module.exports = router;
