const express = require("express");
const r = express.Router();
const { upload } = require("../config/cloudinary");
const { registerUser, loginUser, getMe, forgotPassword, verifyOTP, resetPassword, updateAvatar } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

r.post("/register", registerUser);
r.post("/login", loginUser);
r.get("/me", protect, getMe);
r.post("/forgot-password", forgotPassword);
r.post("/verify-otp", verifyOTP);
r.post("/reset-password", resetPassword);
r.post("/avatar", protect, upload.single("image"), updateAvatar);

module.exports = r;