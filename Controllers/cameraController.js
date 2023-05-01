const Camera = require("../Models/cameraModel");
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const mongoose = require("mongoose");

exports.getAllCamera = factory.getAll(Camera);
exports.getCamera = factory.getOne(Camera);
exports.deleteCamera = factory.deleteOne(Camera);

exports.addCamera = catchAsync(async (req, res, next) => {
  const {  location, owner } = req.body;
  const camera = await Camera.create({
    location,
    owner,
  });
  res.status(201).json({
    status: "success",
    data: {
      camera,
    },
  });
});



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

//get cameras of a user
exports.getCameraOfUser = catchAsync(async (req, res, next) => {
  const user_id = req.query.id;
  const cameras = await Camera.find({ owner: { $in: user_id } });
  res.status(200).json({
    status: "success",
    results: cameras.length,
    data: {
      cameras,
    },
  });
});


exports.removeOwner = catchAsync(async (req, res, next) => {
  const camera_id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(camera_id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid camera id",
    });
  }
  
  const camera = await Camera.findById(camera_id);

  if (!camera) {
    return res.status(400).json({
      status: "fail",
      message: "Camera not found",
    });
  }

  

  if (!camera.owner) {
    return res.status(400).json({
      status: "fail",
      message: "Camera does not have an owner",
    });
  }

  const owner = await User.findById(camera.owner);
  if(!owner){
    return res.status(400).json({
      status: "fail",
      message: "Owner not found",
    });
  }

  owner.camera_id = owner.camera_id.filter((id) => id != camera_id); // Remove camera_id from user
  await owner.save();

  next();
});
