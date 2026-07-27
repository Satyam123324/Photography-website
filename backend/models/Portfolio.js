const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    photographer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    media: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      type: { type: String, enum: ["image", "video"], default: "image" },
      thumbnail: { type: String, default: "" }, // video thumbnail
      duration: { type: Number }, // video duration in seconds
    },
    caption: { type: String, maxlength: 500, default: "" },
    category: {
      type: String,
      enum: ["wedding","pre-wedding","post-wedding","modeling","wildlife","event","portrait","fashion","product","travel","food","architecture","sports","newborn","maternity"],
      required: true,
    },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

portfolioSchema.index({ photographer: 1, category: 1 });
portfolioSchema.index({ "media.type": 1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
