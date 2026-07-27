const asyncHandler = require("express-async-handler");
const PhotographerProfile = require("../models/PhotographerProfile");

const updateProfile = asyncHandler(async (req, res) => {
  const { bio, tagline, categories, location, experienceYears, pricing, socialLinks, equipmentUsed, languages, highlights } = req.body;
  const profile = await PhotographerProfile.findOne({ user: req.user._id });
  if (!profile) { res.status(404); throw new Error("Profile not found"); }

  if (bio !== undefined) profile.bio = bio;
  if (tagline !== undefined) profile.tagline = tagline;
  if (categories !== undefined) profile.categories = categories;
  if (location !== undefined) profile.location = location;
  if (experienceYears !== undefined) profile.experienceYears = experienceYears;
  if (pricing !== undefined) profile.pricing = pricing;
  if (socialLinks !== undefined) profile.socialLinks = socialLinks;
  if (equipmentUsed !== undefined) profile.equipmentUsed = equipmentUsed;
  if (languages !== undefined) profile.languages = languages;
  if (highlights !== undefined) profile.highlights = highlights;

  const filled = profile.bio && profile.categories?.length > 0 && profile.location?.city;
  profile.profileCompleted = !!filled;

  res.json(await profile.save());
});

const uploadCoverImage = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No image uploaded"); }
  const { uploadToCloudinary } = require("../config/cloudinary");
  const result = await uploadToCloudinary(
    req.file.buffer,
    `photoconnect/covers/${req.user._id}`,
    "image"
  );
  const profile = await PhotographerProfile.findOne({ user: req.user._id });
  profile.coverImage = { url: result.secure_url, publicId: result.public_id };
  res.json(await profile.save());
});

const getPhotographers = asyncHandler(async (req, res) => {
  const { category, city, minRating, sortBy, search } = req.query;
  const filter = { isApproved: true };
  if (category) filter.categories = category;
  if (city) filter["location.city"] = new RegExp(city, "i");
  if (minRating) filter.averageRating = { $gte: Number(minRating) };

  let query = PhotographerProfile.find(filter).populate("user", "name email avatar phone");
  if (search) {
    // will filter after populate
  }
  if (sortBy === "rating") query = query.sort({ averageRating: -1 });
  else if (sortBy === "experience") query = query.sort({ experienceYears: -1 });
  else if (sortBy === "bookings") query = query.sort({ totalBookings: -1 });
  else query = query.sort({ createdAt: -1 });

  let results = await query;
  if (search) {
    const re = new RegExp(search, "i");
    results = results.filter(p => re.test(p.user?.name) || re.test(p.location?.city) || re.test(p.tagline));
  }
  res.json(results);
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
