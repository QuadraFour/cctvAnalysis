const express = require("express");
const incidentController = require("../Controllers/incidentController");
const router = express.Router();
router.route("/").get(incidentController.getAllIncidents);
router.route("/add").get(incidentController.addIncident);

module.exports = router;
