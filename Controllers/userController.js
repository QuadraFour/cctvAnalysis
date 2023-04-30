const User = require("../Models/userModel");
const Incident = require("../Models/incidentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role, camera_id } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;
  if (role === "admin") {
    console.log(req.body);
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      camera_id: null,
    });
  } else if (role === "user") {
    if (!camera_id) {
      return res.status(400).json({
        status: "fail",
        message: "Camera ID is required for user role",
      });
    }
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      camera_id,
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      user: newUser.name,
    },
  });
});

exports.getIncidents = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  let incidents = [];
  if (user.role === "admin") {
    incidents = await Incident.find();
  } else {
    for (let i = 0; i < user.camera_id.length; i++) {
      // Loop through all camera_id
      incidents.push(await Incident.find({ cameraId: user.camera_id[i] }));
    }
  }
  res.status(200).json({
    status: "success",
    data: {
      incidents,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  //if  no user found send json error
  if (!user)
    return res
      .status(400)
      .json({ status: "fail", message: "Incorrect password or email" });

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  //if wrong password send json error
  if (!isPasswordValid)
    return res
      .status(400)
      .json({ status: "fail", message: "Incorrect password or email" });

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "secret123"
    );
    res.status(200).json({
      status: "success",
      user: token,
    });
  } else {
    return next(new AppError("Incorrect password", 401));
  }
});
