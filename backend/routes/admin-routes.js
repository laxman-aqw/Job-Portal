const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const { protectAdmin } = require("../middlewares/auth.middleware");
router.post("/register", adminController.addAdmin);
router.post("/login", adminController.adminLogin);
router.get("/users", adminController.getUsers);
router.get("/job-seekers", protectAdmin, adminController.getTotalJobSeekers);
router.get("/recruiters", protectAdmin, adminController.getTotalRecruiters);
router.get("/monthly-jobs", protectAdmin, adminController.getMonthlyJobPosts);
router.get(
  "/applications-count",
  protectAdmin,
  adminController.getApplicationStatusCounts
);
router.get(
  "/top-companies",
  protectAdmin,
  adminController.getTopCompaniesByJobPosts
);

module.exports = router;
