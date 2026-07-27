const asyncHandler = require("express-async-handler");
const Portfolio = require("../models/Portfolio");
const { uploadToCloudinary } = require("../config/cloudinary");

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No file uploaded"); }
  if (!req.body.category) { res.status(400); throw new Error("Category is required"); }

  const isVideo = req.file.mimetype.startsWith("video/");
  const result = await uploadToCloudinary(
    req.file.buffer,
    `photoconnect/portfolios/${req.user._id}`,
    isVideo ? "video" : "image"
  );

  const post = await Portfolio.create({
    photographer: req.user._id,
    media: {
      url: result.secure_url,
      publicId: result.public_id,
      type: isVideo ? "video" : "image",
      thumbnail: isVideo ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : "",
    },
    caption: req.body.caption || "",
    category: req.body.category,
    tags: req.body.tags ? req.body.tags.split(",").map(t => t.trim()) : [],
  });
  res.status(201).json(post);
});

const getPortfolioByPhotographer = asyncHandler(async (req, res) => {
  const filter = { photographer: req.params.photographerId };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.type) filter["media.type"] = req.query.type;
  res.json(await Portfolio.find(filter).sort({ createdAt: -1 }));
});

const getFeed = asyncHandler(async (req, res) => {
  const { category, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (type) filter["media.type"] = type;
  const posts = await Portfolio.find(filter)
    .populate("photographer", "name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(posts);
});

const deleteMedia = asyncHandler(async (req, res) => {
  const post = await Portfolio.findById(req.params.id);
  if (!post) { res.status(404); throw new Error("Not found"); }
  if (post.photographer.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  await post.deleteOne();
  res.json({ message: "Deleted" });
});

const toggleLike = asyncHandler(async (req, res) => {
  const post = await Portfolio.findById(req.params.id);
  if (!post) { res.status(404); throw new Error("Not found"); }
  const idx = post.likes.indexOf(req.user._id);
  if (idx === -1) post.likes.push(req.user._id);
  else post.likes.splice(idx, 1);
  await post.save();
  res.json({ likes: post.likes.length, liked: idx === -1 });
});

module.exports = { uploadMedia, getPortfolioByPhotographer, getFeed, deleteMedia, toggleLike };