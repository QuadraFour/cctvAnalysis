const Camera = require("../Models/cameraModel");
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const mongoose = require("mongoose");

exports.getAllCamera = factory.getAll(Camera);
exports.addCamera = factory.createOne(Camera, true);
exports.getCamera = factory.getOne(Camera);
exports.deleteCamera = factory.deleteOne(Camera);

exports.assignOwner = catchAsync(async (req, res, next) => {
  const camera_id = req.body.id;
  const id = req.body.user;
  const camera = await Camera.findById(camera_id);
  const owner = await User.findById(id);
  if (camera.owner) {
    return next(new AppError("Camera already has an owner", 400));
  }
  camera.owner = id;
  owner.camera_id = owner.camera_id
    ? [...owner.camera_id, camera_id]
    : [camera_id];
  await camera.save();
  await owner.save();
  res.status(200).json({
    status: "success",
    data: {
      camera,
      owner,
    },
  });
});

exports.removeOwner = catchAsync(async (req, res, next) => {
  const camera_id = req.params.id;
  const camera = await Camera.findById(camera_id);
  const owner = await User.findById(camera.owner);
  owner.camera_id = owner.camera_id.filter((id) => id != camera_id); // Remove camera_id from user
  await owner.save();

  next();
});
