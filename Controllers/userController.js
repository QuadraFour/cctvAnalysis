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
  try {
    const newPassword=await bcrypt.hash(req.body.password,10);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      role: req.body.role,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser.name,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.getIncidents=catchAsync(async(req,res,next)=>{
    const user=await User.findById({
      email:req.body.email
    });
    const incidents=await Incident.find({camera_id:user.camera_id});
    res.status(200).json({
        status:"success",
        data:{
            incidents
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  //if no user found send json error
  if (!user) return res.status(400).json({status:"fail",message:"Incorrect password or email"});

  const isPasswordValid=await bcrypt.compare(req.body.password,user.password);


  //if wrong password send json error
  if(!isPasswordValid) return res.status(400).json({status:"fail",message:"Incorrect password or email"});

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


