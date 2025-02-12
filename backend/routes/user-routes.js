const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const userController = require("../controllers/user-controller");
const { requireAuth } = require("@clerk/express");
const { protectUser } = require("../middlewares/auth.middleware");
router.post("/apply-job", protectUser, userController.applyJob);
router.get("/applications", protectUser, userController.getUserAppliedJobs);
router.put("/profile-update", protectUser, userController.updateProfile);

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
router.get("/user", protectUser, userController.getUserData);
module.exports = router;
