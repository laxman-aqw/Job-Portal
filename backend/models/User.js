const mongoose = require("mongoose");
const IndustryInsight = require("./IndustryInsight");
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  displayEmail: { type: String },
  resume: { type: String, default: "" },
  image: { type: String },
  password: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  address: { type: String },
  description: { type: String },
  experience: [
    {
      jobTitle: String,
      companyName: String,
      startDate: Date,
      endDate: { type: Date },
      description: String,
    },
  ],
  education: [
    {
      institutionName: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      grade: Number,
    },
  ],
  skills: [{ type: String }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  industryInsight: [
    { type: mongoose.Schema.Types.ObjectId, ref: "IndustryInsight" },
  ],
  assessments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
    },
  ],
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
  },
  coverLetters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoverLetter",
    },
  ],
  notifications: [
    {
      type: String,
      message: String,
      read: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  linkedInProfile: String,
  githubProfile: String,
  portfolioWebsite: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  industry: String,
});

module.exports = mongoose.model("User", userSchema);
