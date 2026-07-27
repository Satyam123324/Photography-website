const mongoose = require("mongoose");

const photographerProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, maxlength: 2000, default: "" },
    tagline: { type: String, maxlength: 150, default: "" },
    coverImage: { url: { type: String, default: "" }, publicId: { type: String, default: "" } },
    categories: [{
      type: String,
      enum: ["wedding","pre-wedding","post-wedding","modeling","wildlife","event","portrait","fashion","product","travel","food","architecture","sports","newborn","maternity"],
    }],
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "India" },
      pincode: { type: String, default: "" },
    },
    experienceYears: { type: Number, default: 0 },
    equipmentUsed: [{ type: String }],
    languages: [{ type: String }],
    pricing: { type: Map, of: Number, default: {} },
    socialLinks: {
      instagram: { type: String, default: "" },
      website: { type: String, default: "" },
      youtube: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
    highlights: [{ type: String }], // e.g. "500+ weddings shot", "Featured in Vogue"
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhotographerProfile", photographerProfileSchema);
