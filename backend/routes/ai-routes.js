const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const aiIndustryControllers = require("../controllers/ai-controllers/getIndustryInsights");
const aiQuizControllers = require("../controllers/ai-controllers/generateQuiz");
const aiResumeControllers = require("../controllers/ai-controllers/generateResume");
const { protectUser } = require("../middlewares/auth.middleware");

router.post(
  "/industry-insights",
  protectUser,
  aiIndustryControllers.getIndustryInsights
);
router.get("/generate-quiz", protectUser, aiQuizControllers.generateQuiz);
router.get("/assessments", protectUser, aiQuizControllers.getAssessments);
router.post("/save-quiz-result", protectUser, aiQuizControllers.saveQuizResult);
router.get("/generate-resume", protectUser, aiResumeControllers.generateResume
);

module.exports = router;
