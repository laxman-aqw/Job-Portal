const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/company-controller");
const upload = require("../config/multer");
const { protectCompany } = require("../middlewares/auth.middleware");

router.post(
  "/register",
  upload.single("image"),
  companyControllers.registerCompany
);

router.post("/login", companyControllers.loginCompany);

router.get("/company", protectCompany, companyControllers.getCompanyData);

router.post("/post-job", protectCompany, companyControllers.postJob);

router.get(
  "/applicants",
  protectCompany,
  companyControllers.getCompanyJobApplicants
);

router.get(
  "/list-jobs",
  protectCompany,
  companyControllers.getCompanyPostedJobs
);

router.post(
  "/change-status",
  protectCompany,
  companyControllers.changeJobApplicationStatus
);

router.post(
  "/change-visibility",
  protectCompany,
  companyControllers.changeVisibility
);

module.exports = router;
