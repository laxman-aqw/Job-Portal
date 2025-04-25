const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const aiIndustryControllers = require("../controllers/ai-controllers/getIndustryInsights");
const aiQuizControllers = require("../controllers/ai-controllers/generateQuiz");
const { protectUser } = require("../middlewares/auth.middleware");

router.post(
  "/industry-insights",
  protectUser,
  aiIndustryControllers.getIndustryInsights
);
router.get("/generate-quiz", protectUser, aiQuizControllers.generateQuiz);
router.post("/save-quiz", protectUser, aiQuizControllers.saveQuizResult);
router.get("/generate-quiz", protectUser, aiQuizControllers.generateQuiz);

module.exports = router;
