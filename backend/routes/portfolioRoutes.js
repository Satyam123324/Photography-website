const express = require("express");
const router = express.Router();
const multer = require("multer");
const { portfolioStorage } = require("../config/cloudinary");
const upload = multer({ storage: portfolioStorage });
const { uploadPortfolioImage, getPortfolioByPhotographer, getFeed, deletePortfolioImage } = require("../controllers/portfolioController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getFeed);
router.get("/:photographerId", getPortfolioByPhotographer);
router.post("/", protect, authorize("photographer"), upload.single("image"), uploadPortfolioImage);
router.delete("/:id", protect, authorize("photographer"), deletePortfolioImage);
module.exports = router;
