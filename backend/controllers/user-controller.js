const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//register user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const imageFile = req.file;
  if (!firstName || !lastName || !email || !password || !imageFile) {
    return res
      .status(404)
      .json({ success: false, message: "fields are missing" });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    const existingCompany = await Company.findOne({ email: email });
    if (existingUser || existingCompany) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      image: newUser.image,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      company: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        image: newUser.image,
      },
      token: generateToken(payload),
    });
  } catch (error) {
    console.error("Error checking existing company:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// validate email
exports.validateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ success: false, exists: true });
    }
    res.status(200).json({ success: true, exists: false });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    };

    if (isPasswordValid) {
      const token = generateToken(payload);
      // console.log(token);
      res.status(200).json({
        success: true,
        message: "login succesful",
        company: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
        },
        token,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User data not found with token",
      });
    }
    // console.log(req.user);

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user data",
      error: error.message,
    });
  }
};

exports.applyJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

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
  const userId = req.user._id;
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
  const userId = req.user._id;
  console.log("the user id is: ", userId);
  try {
    const resumeFile = req.file;
    console.log(resumeFile);

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
