const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { updateProfile, uploadCoverImage, getPhotographers, getPhotographerById, getMyProfile } = require("../controllers/photographerController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getPhotographers);
router.get("/me", protect, authorize("photographer"), getMyProfile);
router.get("/:id", getPhotographerById);
router.put("/profile", protect, authorize("photographer"), updateProfile);
router.post("/cover", protect, authorize("photographer"), upload.single("image"), uploadCoverImage);
module.exports = router;