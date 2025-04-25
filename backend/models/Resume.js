const mongoose = require("mongoose");
const { Schema } = mongoose;

const resumeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One resume per user
  },
  content: {
    type: String, // Markdown content
    required: true,
  },
  feedback: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
