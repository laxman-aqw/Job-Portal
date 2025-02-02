const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const userController = require("../controllers/user-controller");
router.get("/user", userController.getUserData);
router.post("/apply-job", userController.applyJob);
router.get("/applications", userController.getUserAppliedJobs);
router.put(
  "/update-resume",
  upload.single("resume"),
  userController.updateUserResume
);

module.exports = router;
