const mongoose = require("mongoose");
const slugify = require("slugify");
const cameraSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
cameraSchema.index({ location: "2dsphere" });

module.exports =
  mongoose.models.Camera || mongoose.model("Camera", cameraSchema);
