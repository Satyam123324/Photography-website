const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password -resetOTP -resetOTPExpiry");
      if (!req.user) { res.status(401); throw new Error("User not found"); }
      return next();
    } catch {
      res.status(401); throw new Error("Not authorized, invalid token");
    }
  }
  res.status(401); throw new Error("Not authorized, no token");
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403); throw new Error(`Role '${req.user.role}' is not allowed`);
  }
  next();
};

module.exports = { protect, authorize };
