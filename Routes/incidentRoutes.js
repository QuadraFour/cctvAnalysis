const express = require("express");
const incidentController = require("../Controllers/incidentController");
const userController=require("../Controllers/userController");
const router = express.Router();

router.route("/").get(incidentController.getAllIncidents);
router.route("/add").get(incidentController.addIncident);
router.route("/users").get(userController.getAllUsers);
router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);

module.exports = router;
