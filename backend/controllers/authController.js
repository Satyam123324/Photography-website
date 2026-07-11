const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const PhotographerProfile = require("../models/PhotographerProfile");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error("Please provide name, email and password"); }
  if (await User.findOne({ email })) { res.status(400); throw new Error("Email already registered"); }

  const user = await User.create({ name, email, password, phone, role: role === "photographer" ? "photographer" : "customer" });
  if (user.role === "photographer") await PhotographerProfile.create({ user: user._id });

  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar,
    token: generateToken(user._id, user.role),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error("Invalid email or password"); }
  res.json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, avatar: user.avatar,
    token: generateToken(user._id, user.role),
  });
});

const getMe = asyncHandler(async (req, res) => res.json(req.user));

module.exports = { registerUser, loginUser, getMe };
