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

router.post("/check-email", companyControllers.validateEmail);

router.post("/login", companyControllers.loginCompany);

router.get("/company", protectCompany, companyControllers.getCompanyData);

router.post("/post-job", protectCompany, companyControllers.postJob);
router.put(
  "/update-company",
  protectCompany,
  upload.single("image"),
  companyControllers.updateCompanyData
);

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

router.put(
  "/change-status",
  protectCompany,
  companyControllers.changeJobApplicationStatus
);

router.post(
  "/change-visibility",
  protectCompany,
  companyControllers.changeVisibility
);

router.get("/company-profile/:id", companyControllers.getCompanyDataById);

module.exports = router;
