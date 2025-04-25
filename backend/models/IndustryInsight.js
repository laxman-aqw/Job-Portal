const mongoose = require("mongoose");
const { Schema } = mongoose;

const industryInsightSchema = new Schema({
  industry: {
    type: String,

    unique: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  salaryRanges: {
    type: [Schema.Types.Mixed],
  },
  growthRate: {
    type: Number,
  },
  demandLevel: {
    type: String,
    enum: ["High", "Medium", "Low"],
  },
  topSkills: {
    type: [String],
  },
  marketOutlook: {
    type: String,
    enum: ["Positive", "Neutral", "Negative"],
  },
  keyTrends: {
    type: [String],
  },
  recommendedSkills: {
    type: [String],
  },
  lastUpdated: {
    type: Date,
    default: () => new Date(),
  },
  nextUpdate: {
    type: Date,
  },
});

module.exports = mongoose.model("IndustryInsight", industryInsightSchema);
