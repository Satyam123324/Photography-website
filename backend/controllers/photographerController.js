const asyncHandler = require("express-async-handler");
const PhotographerProfile = require("../models/PhotographerProfile");

const updateProfile = asyncHandler(async (req, res) => {
  const { bio, categories, location, experienceYears, pricing, socialLinks } = req.body;
  const profile = await PhotographerProfile.findOne({ user: req.user._id });
  if (!profile) { res.status(404); throw new Error("Profile not found"); }
  if (bio !== undefined) profile.bio = bio;
  if (categories !== undefined) profile.categories = categories;
  if (location !== undefined) profile.location = location;
  if (experienceYears !== undefined) profile.experienceYears = experienceYears;
  if (pricing !== undefined) profile.pricing = pricing;
  if (socialLinks !== undefined) profile.socialLinks = socialLinks;
  res.json(await profile.save());
});

const uploadCoverImage = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No image uploaded"); }
  const profile = await PhotographerProfile.findOne({ user: req.user._id });
  profile.coverImage = { url: req.file.path, publicId: req.file.filename };
  res.json(await profile.save());
});

const getPhotographers = asyncHandler(async (req, res) => {
  const { category, city, minRating, sortBy } = req.query;
  const filter = { isApproved: true };
  if (category) filter.categories = category;
  if (city) filter["location.city"] = new RegExp(city, "i");
  if (minRating) filter.averageRating = { $gte: Number(minRating) };
  let query = PhotographerProfile.find(filter).populate("user", "name email avatar");
  if (sortBy === "rating") query = query.sort({ averageRating: -1 });
  if (sortBy === "experience") query = query.sort({ experienceYears: -1 });
  res.json(await query);
});

const getPhotographerById = asyncHandler(async (req, res) => {
  const profile = await PhotographerProfile.findOne({ user: req.params.id }).populate("user", "name email avatar phone");
  if (!profile) { res.status(404); throw new Error("Photographer not found"); }
  res.json(profile);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await PhotographerProfile.findOne({ user: req.user._id }).populate("user", "name email avatar phone");
  if (!profile) { res.status(404); throw new Error("Profile not found"); }
  res.json(profile);
});

module.exports = { updateProfile, uploadCoverImage, getPhotographers, getPhotographerById, getMyProfile };
