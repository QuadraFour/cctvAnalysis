const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please Enter The Type of the Incident"],
    },
    cameraId: {
      type: mongoose.Schema.ObjectId,
      ref: "Camera",
      required: [true, "Please Enter The Camera Id"],
    },
    locality: {
      type: String,
      required: [true, "Please Enter The Locality of the Incident"],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      city: String,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports =
  mongoose.models.Incident || mongoose.model("Incident", incidentSchema);
