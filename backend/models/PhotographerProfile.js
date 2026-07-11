const mongoose = require("mongoose");

const photographerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, maxlength: 1000, default: "" },
    coverImage: { url: { type: String, default: "" }, publicId: { type: String, default: "" } },
    categories: [
      {
        type: String,
        enum: ["wedding","pre-wedding","post-wedding","modeling","wildlife","event","portrait","fashion","product","travel"],
      },
    ],
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    experienceYears: { type: Number, default: 0 },
    pricing: { type: Map, of: Number, default: {} },
    socialLinks: {
      instagram: { type: String, default: "" },
      website: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhotographerProfile", photographerProfileSchema);
