const express = require("express");
const router = express.Router();
const companyControllers = require("../controllers/company-controller");
const upload = require("../config/multer");

router.post(
  "/register",
  upload.single("image"),
  companyControllers.registerCompany
);

router.post("/login", companyControllers.loginCompany);

router.get("/company", companyControllers.getCompanyData);

router.post("/post-job", companyControllers.postJob);

router.get("/applicants", companyControllers.getCompanyJobApplicants);

router.get("/list-jobs", companyControllers.getCompanyPostedJobs);

router.post("/change-status", companyControllers.changeJobApplicationStatus);

router.post("/change-visibility", companyControllers.changeVisibility);

module.exports = router;
