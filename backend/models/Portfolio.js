const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    photographer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { url: { type: String, required: true }, publicId: { type: String, required: true } },
    caption: { type: String, maxlength: 300, default: "" },
    category: {
      type: String,
      enum: ["wedding","pre-wedding","post-wedding","modeling","wildlife","event","portrait","fashion","product","travel"],
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
