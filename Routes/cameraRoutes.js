const express = require("express");
const cameraController = require("../Controllers/cameraController");

const router = express.Router();

router.route("/").get(cameraController.getAllCamera);
router
  .route("/add")
  .post(cameraController.addCamera, cameraController.assignOwner);
router.route("/getCamera/:id").get(cameraController.getCamera);
router
  .route("/remove/:id")
  .delete(cameraController.removeOwner, cameraController.deleteCamera);
module.exports = router;
