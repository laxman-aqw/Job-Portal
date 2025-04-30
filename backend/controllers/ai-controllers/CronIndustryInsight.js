const cron = require("node-cron");
const IndustryInsight = require("../../models/IndustryInsight");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

(async () => {
  console.log("🚀 Checking overdue industry insights on startup...");

  try {
    const insightsToUpdate = await IndustryInsight.find({
      nextUpdate: { $lte: new Date() },
    });

    for (const insight of insightsToUpdate) {
      const updated = await generateAIInsights(insight.industry);

      insight.set({
        ...updated,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
      });

      await insight.save();
      console.log(`✅ Startup updated insights for: ${insight.industry}`);
    }
  } catch (err) {
    console.error("❌ Error updating insights on startup:", err.message);
  }
})();

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

// ⏰ Schedule cron at 12:00 AM daily
cron.schedule("0 0 * * *", async () => {
  console.log("🔁 Running industry insight update job...");

  try {
    const insightsToUpdate = await IndustryInsight.find({
      nextUpdate: { $lte: new Date() },
    });

    for (const insight of insightsToUpdate) {
      const updated = await generateAIInsights(insight.industry);

      insight.set({
        ...updated,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });

      await insight.save();
      console.log(`✅ Updated insights for: ${insight.industry}`);
    }
  } catch (err) {
    console.error("❌ Error during insight update:", err.message);
  }
});
