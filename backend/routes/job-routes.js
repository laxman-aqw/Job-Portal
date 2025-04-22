const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job-controller");
const { protectCompany } = require("../middlewares/auth.middleware");
const classifierController = require("../controllers/classification-controller");
// const { fetchAndExtractText } = require("../utils/resumeExtraction");

router.get("/parse-resume", jobController.parseResume);
router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJob);
router.put("/update-job/:id", protectCompany, jobController.updateJob);
router.post("/job-category", jobController.addJobRoleCategory);
router.post("/recommend-jobs", jobController.recommendJobs);
router.post("/classify-job", classifierController.classifyText);
router.post("/train-job", classifierController.trainModel);
module.exports = router;
