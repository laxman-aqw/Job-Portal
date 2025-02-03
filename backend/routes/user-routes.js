const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const userController = require("../controllers/user-controller");
const { requireAuth } = require("@clerk/express");
router.get("/user", requireAuth(), userController.getUserData);
router.post("/apply-job", userController.applyJob);
router.get("/applications", userController.getUserAppliedJobs);
router.put(
  "/update-resume",
  upload.single("resume"),
  userController.updateUserResume
);

module.exports = router;
