const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    camera_id: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { collection: "users" }
);

const model = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = model;
