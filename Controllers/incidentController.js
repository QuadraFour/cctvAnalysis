const Incident = require("../Models/incidentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");
const mongoose = require("mongoose");

exports.getAllIncidents = factory.getAll(Incident);
exports.addIncident = factory.createOne(Incident);
