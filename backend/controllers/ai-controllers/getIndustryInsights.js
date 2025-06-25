const mongoose = require("mongoose");
const IndustryInsight = require("../../models/IndustryInsight");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "Nepal" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};

exports.getIndustryInsights = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.industry) {
      return res.status(400).json({
        success: false,
        message: "Please add a interested industry in you profile.",
      });
    }

    // Check if insights already exist
    const existing = await IndustryInsight.findOne({ industry: user.industry });
    console.log("the industry is ", user.industry);

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Industry insights already exist",
        industryInsight: existing,
      });
    }

    // Generate new insights
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await IndustryInsight.create({
      industry: user.industry,
      ...insights,
      nextUpdate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: "Industry insights generated successfully",
      industryInsight,
    });
  } catch (error) {
    console.error("Error generating insights:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
