const mongoose = require("mongoose");
const User = require("../models/User");
const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("cloudinary").v2;
exports.getUserData = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: User ID is missing",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.applyJob = async (req, res) => {
  const { jobId } = req.body;
  const { userId } = req.auth;

  try {
    const isApplied = await Application.findOne({ jobId, userId });
    if (isApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const application = await Application.create({
      companyId: job.companyId,
      userId,
      jobId,
    });

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error checking application status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUserAppliedJobs = async (req, res) => {
  const { userId } = req.auth;
  try {
    const applications = await Application.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary");
    if (!applications) {
      return res.status(404).json({
        success: false,
        message: "No applications found",
      });
    }

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching user's applications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateUserResume = async (req, res) => {
  // Update user's resume
  const { userId } = req.auth;
  try {
    const resumeFile = req.resumeFile;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      user.resume = resumeUpload.secure_url;
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
    });
  } catch (error) {
    console.error("Error updating user's resume:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
