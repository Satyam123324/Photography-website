const asyncHandler = require("express-async-handler");
const Portfolio = require("../models/Portfolio");

const uploadPortfolioImage = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error("No image uploaded"); }
  if (!req.body.category) { res.status(400); throw new Error("Category is required"); }
  const post = await Portfolio.create({
    photographer: req.user._id,
    image: { url: req.file.path, publicId: req.file.filename },
    caption: req.body.caption || "",
    category: req.body.category,
  });
  res.status(201).json(post);
});

const getPortfolioByPhotographer = asyncHandler(async (req, res) => {
  const filter = { photographer: req.params.photographerId };
  if (req.query.category) filter.category = req.query.category;
  res.json(await Portfolio.find(filter).sort({ createdAt: -1 }));
});

const getFeed = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 12 } = req.query;
  const filter = category ? { category } : {};
  const posts = await Portfolio.find(filter)
    .populate("photographer", "name avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(posts);
});

const deletePortfolioImage = asyncHandler(async (req, res) => {
  const post = await Portfolio.findById(req.params.id);
  if (!post) { res.status(404); throw new Error("Image not found"); }
  if (post.photographer.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  await post.deleteOne();
  res.json({ message: "Image deleted" });
});

module.exports = { uploadPortfolioImage, getPortfolioByPhotographer, getFeed, deletePortfolioImage };
