const mongoose = require("mongoose");
const { Schema } = mongoose;

const assessmentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizScore: {
    type: Number,
    required: true,
  },
  questions: {
    type: [Schema.Types.Mixed], // Or define a detailed schema if needed
    required: true,
  },
  improvementTip: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
