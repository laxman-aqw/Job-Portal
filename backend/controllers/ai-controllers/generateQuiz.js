const IndustryInsight = require("../../models/IndustryInsight");
const Assessment = require("../../models/Assessment");
const User = require("../../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate quiz based on user industry and skills
exports.generateQuiz = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.industry) {
      return res
        .status(400)
        .json({ success: false, message: "User industry not found." });
    }

    // console.log(user.industry, user.skills);

    const prompt = `
  Generate 10 **unique** and diverse technical interview questions for a ${
    user.industry
  } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
  Use randomness seed ${Math.floor(Math.random() * 100000)}.
  Each question must be multiple choice with 4 options.
  
  Return JSON only:
  {
    "questions": [  {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": "string",
            "explanation": "string"
          }]
  }
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response
      .text()
      .replace(/```(?:json)?\n?/g, "")
      .trim();
    const quiz = JSON.parse(responseText);

    res.status(200).json({ success: true, questions: quiz.questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate quiz" });
  }
};

exports.saveQuizResult = async (req, res) => {
  try {
    const user = req.user;
    const { questions, answers, score } = req.body;

    if (!user || !questions || !answers || typeof score !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input." });
    }

    const questionResults = questions.map((q, index) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
    let improvementTip = null;

    if (wrongAnswers.length > 0) {
      const wrongText = wrongAnswers
        .map(
          (q) =>
            `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        )
        .join("\n\n");

      const improvementPrompt = `
        The user got the following ${user.industry} technical interview questions wrong:

        ${wrongText}

        Based on these mistakes, provide a concise, specific improvement tip.
        Focus on the knowledge gaps revealed by these wrong answers.
        Keep the response under 2 sentences and make it encouraging.
      `;

      try {
        const tipResult = await model.generateContent(improvementPrompt);
        improvementTip = tipResult.response.text().trim();
      } catch (err) {
        console.error("Error generating improvement tip:", err.message);
      }
    }

    const assessment = await Assessment.create({
      userId: user._id,
      quizScore: score,
      questions: questionResults,
      category: "Technical",
      improvementTip,
    });
    console.log("quiz result saved to database succesfully");
    res.status(201).json({ success: true, assessment });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to save quiz result" });
  }
};

// Get all assessments for logged-in user
exports.getAssessments = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const assessments = await Assessment.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    console.log("assessment api called");

    res.status(200).json({ success: true, assessments });
  } catch (error) {
    console.error("Error fetching assessments:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch assessments" });
  }
};
