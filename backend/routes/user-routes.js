const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const userController = require("../controllers/user-controller");
const { requireAuth } = require("@clerk/express");
const { protectUser } = require("../middlewares/auth.middleware");
router.post("/apply-job", protectUser, userController.applyJob);
router.put(
  "/edit-experience/:id",
  protectUser,
  userController.updateJobExperience
);
router.delete(
  "/delete-experience/:id",
  protectUser,
  userController.deleteJobExperience
);
router.post("/add-experience", protectUser, userController.addJobExperience);
router.get("/applications", protectUser, userController.getUserAppliedJobs);
router.put(
  "/profile-update",
  protectUser,
  upload.single("image"),
  userController.updateProfile
);

router.post("/register", upload.single("image"), userController.registerUser);
router.put(
  "/update-resume",
  upload.single("resume"),
  protectUser,
  userController.updateUserResume
);

router.post("/check-email", userController.validateEmail);
router.post("/login", userController.loginUser);
router.get("/profile/:id", userController.getProfile);
router.get(
  "/profile-experience/:id",
  protectUser,
  userController.getExperienceById
);
router.get("/user", protectUser, userController.getUserData);
module.exports = router;
