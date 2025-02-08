const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job-controller");
const { protectCompany } = require("../middlewares/auth.middleware");

router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJob);
router.put("/update-job/:id", protectCompany, jobController.updateJob);

module.exports = router;
