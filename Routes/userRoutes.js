const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();

router.route("/users").get(userController.getAllUsers);
router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/getIncidents").get(userController.getIncidents);
module.exports = router;
