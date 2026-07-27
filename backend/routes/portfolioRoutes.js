const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { uploadMedia, getPortfolioByPhotographer, getFeed, deleteMedia, toggleLike } = require("../controllers/portfolioController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getFeed);
router.get("/:photographerId", getPortfolioByPhotographer);
router.post("/", protect, authorize("photographer"), upload.single("media"), uploadMedia);
router.delete("/:id", protect, authorize("photographer"), deleteMedia);
router.post("/:id/like", protect, toggleLike);
module.exports = router;