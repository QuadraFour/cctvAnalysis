const express = require("express");
const userController = require("../Controllers/userController");

const router = express.Router();

router.route("/").get(userController.getAllUsers);
router.route("/signup").post(userController.signup);
router.route("/login").post(userController.login);
router.route("/getIncidents").post(userController.getIncidents);

module.exports = router;
