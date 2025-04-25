const mongoose = require("mongoose");
const { Schema } = mongoose;

const coverLetterSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    default: null,
  },
  companyName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "completed"],
    default: "draft",
  },
});

module.exports = mongoose.model("CoverLetter", coverLetterSchema);
