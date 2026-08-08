const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/User");
const PhotographerProfile = require("../models/PhotographerProfile");
const generateToken = require("../utils/generateToken");
const { sendOTPEmail } = require("../config/email");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error("Name, email and password are required"); }
  if (password.length < 6) { res.status(400); throw new Error("Password must be at least 6 characters"); }
  if (await User.findOne({ email })) { res.status(400); throw new Error("Email already registered"); }

  const user = await User.create({ name, email, password, phone, role: role === "photographer" ? "photographer" : "customer" });
  if (user.role === "photographer") await PhotographerProfile.create({ user: user._id });

  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar, phone: user.phone,
    token: generateToken(user._id, user.role),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error("Invalid email or password"); }
  res.json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar, phone: user.phone,
    token: generateToken(user._id, user.role),
  });
});

const getMe = asyncHandler(async (req, res) => res.json(req.user));

// FORGOT PASSWORD — send OTP
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) { res.status(404); throw new Error("No account found with this email"); }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  user.resetOTP = crypto.createHash("sha256").update(otp).digest("hex");
  user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  try {
    await sendOTPEmail(user.email, user.name, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500); throw new Error("Email could not be sent");
  }
});

// VERIFY OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({ email, resetOTP: hashedOTP, resetOTPExpiry: { $gt: Date.now() } });
  if (!user) { res.status(400); throw new Error("Invalid or expired OTP"); }
  res.json({ message: "OTP verified", valid: true });
});

// RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  if (!password || password.length < 6) { res.status(400); throw new Error("Password must be at least 6 characters"); }
  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  const user = await User.findOne({ email, resetOTP: hashedOTP, resetOTPExpiry: { $gt: Date.now() } });
  if (!user) { res.status(400); throw new Error("Invalid or expired OTP"); }

  user.password = password;
  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  await user.save();
  res.json({ message: "Password reset successful" });
});

// UPDATE profile picture
const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No image uploaded"); }
  const { uploadToCloudinary } = require("../config/cloudinary");
  const result = await uploadToCloudinary(
    req.file.buffer,
    `photoconnect/avatars/${req.user._id}`,
    "image"
  );
  const user = await User.findById(req.user._id);
  user.avatar = { url: result.secure_url, publicId: result.public_id };
  await user.save({ validateBeforeSave: false });
  res.json({ avatar: user.avatar });
});

module.exports = { registerUser, loginUser, getMe, forgotPassword, verifyOTP, resetPassword, updateAvatar };
