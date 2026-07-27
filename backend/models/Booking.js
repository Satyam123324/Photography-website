const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    photographer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["wedding","pre-wedding","post-wedding","modeling","wildlife","event","portrait","fashion","product","travel","food","architecture","sports","newborn","maternity"],
      required: true,
    },
    eventDate: { type: Date, required: true },
    eventEndDate: { type: Date },
    location: { type: String, required: true },
    budget: { type: Number },
    numberOfHours: { type: Number },
    numberOfPeople: { type: String },
    notes: { type: String, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["pending","confirmed","rejected","completed","cancelled"],
      default: "pending",
    },
    statusHistory: [{
      status: String,
      changedAt: { type: Date, default: Date.now },
      note: String,
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
