const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const e = require("express");
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
        user: {
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
  const userId = req.user._id.toString();
  console.log("the user id is: ", userId);
  try {
    const resumeFile = req.file;
    console.log(resumeFile);

    const user = await User.findById(userId);
    if (!user) {
      console.log("no user found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!resumeFile) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          resume: resumeUpload.secure_url,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.log("no user found to update");
      return res
        .status(404)
        .json({ success: false, message: "User not found to update" });
    }
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

exports.getProfile = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      message: "User data fetched for profile succesfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  const id = req.user._id.toString();
  const {
    firstName,
    lastName,
    description,
    displayEmail,
    phone,
    address,
    githubProfile,
    linkedInProfile,
    gender,
    industry,
  } = req.body;
  const imageFile = req.file;
  if (!firstName && !lastName) {
    console.log("fields are required");
    return res.status(400).json({
      success: false,
      message: "First name and last name are required",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let imageUrl = user.image;
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = imageUpload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName,
          lastName,
          description,
          phone,
          address,
          githubProfile,
          linkedInProfile,
          gender,
          industry,
          displayEmail,
          image: imageUrl,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.addJobExperience = async (req, res) => {
  const userId = req.user._id.toString();
  const { jobTitle, companyName, startDate, endDate, description } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const newExp = {
      jobTitle,
      companyName,
      startDate,
      endDate: endDate || null,
      description,
    };
    user.experience.push(newExp);
    await user.save();
    return res.status(201).json({
      success: true,
      message: "New job experience added successfully",
      data: newExp, // Return the newly added experience
    });
  } catch (error) {
    console.error("Error adding new job experience:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getExperienceById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId).select("experience");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const exps = user.experience.find((exp) => exp._id.toString() === id);
    if (!exps) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }
    res.status(200).json({
      success: true,
      message: "User job experience fetched succesfully!",
      experience: exps,
    });
  } catch (error) {
    console.error("Error fetching user's job experience:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateJobExperience = async (req, res) => {
  const userId = req.user._id.toString();
  const { id } = req.params;
  const { jobTitle, companyName, startDate, endDate, description } = req.body;
  if (!jobTitle || !companyName || !startDate || !description) {
    console.log("fields are required");
    return res.status(400).json({
      success: false,
      message:
        "Job title, company name, start date, and description are required",
    });
  }
  const user = await User.findById(userId).select("experience");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const expsIndex = user.experience.findIndex(
    (exp) => exp._id.toString() === id
  );
  if (expsIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Experience not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        [`experience.${expsIndex}.jobTitle`]: jobTitle,
        [`experience.${expsIndex}.companyName`]: companyName,
        [`experience.${expsIndex}.startDate`]: startDate,
        [`experience.${expsIndex}.endDate`]: endDate,
        [`experience.${expsIndex}.description`]: description,
      },
    },
    { new: true } // Return the updated document
  );
  return res.status(200).json({
    success: true,
    message: "Experience updated successfully",
    data: updatedUser.experience[expsIndex], // Return the updated experience
  });
};

exports.deleteJobExperience = async (req, res) => {
  const userId = req.user._id.toString();
  const { id } = req.params;
  try {
    const user = await User.findById(userId).select("experience");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const expsIndex = user.experience.findIndex(
      (exp) => exp._id.toString() === id
    );
    if (expsIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { experience: { _id: id } },
    });
    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job experience:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.addEducation = async (req, res) => {
  const userId = req.user._id.toString();
  const { degree, fieldOfStudy, institutionName, startDate, endDate, grade } =
    req.body;
  if (
    !degree ||
    !fieldOfStudy ||
    !institutionName ||
    !startDate ||
    !endDate ||
    !grade
  ) {
    console.log("fields are required");
    return res.status(400).json({
      success: false,
      message:
        "Degree, field of study, institution name, start date, end date, and grade are required",
    });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const newEdu = {
      degree,
      fieldOfStudy,
      institutionName,
      startDate,
      endDate: endDate || null,
      grade,
    };
    user.education.push(newEdu);
    await user.save();
    return res.status(201).json({
      success: true,
      message: "New education added successfully",
      data: newEdu, // Return the newly added experience
    });
  } catch (error) {
    console.error("Error adding new Education:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getEducationById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  try {
    const user = await User.findById(userId).select("education");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const edu = user.education.find((edu) => edu._id.toString() === id);
    if (!edu) {
      return res
        .status(404)
        .json({ success: false, message: "Education not found" });
    }
    res.status(200).json({
      success: true,
      message: "User education details fetched succesfully!",
      education: edu,
    });
  } catch (error) {
    console.error("Error fetching user's education details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateUserEducation = async (req, res) => {
  const userId = req.user._id.toString();
  const { id } = req.params;
  const { degree, fieldOfStudy, institutionName, startDate, endDate, grade } =
    req.body;
  if (
    !degree ||
    !fieldOfStudy ||
    !institutionName ||
    !startDate ||
    !endDate ||
    !grade
  ) {
    console.log("fields are required");
    return res.status(400).json({
      success: false,
      message:
        "Degree, field of study, institution name, start date, end date, and grade are required",
    });
  }
  const user = await User.findById(userId).select("education");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const eduIndex = user.education.findIndex((edu) => edu._id.toString() === id);
  if (eduIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Education not found" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        [`education.${eduIndex}.degree`]: degree,
        [`education.${eduIndex}.fieldOfStudy`]: fieldOfStudy,
        [`education.${eduIndex}.institutionName`]: institutionName,
        [`education.${eduIndex}.startDate`]: startDate,
        [`education.${eduIndex}.endDate`]: endDate,
        [`education.${eduIndex}.grade`]: grade,
      },
    },
    { new: true } // Return the updated document
  );
  return res.status(200).json({
    success: true,
    message: "Education updated successfully",
    data: updatedUser.education[eduIndex],
  });
};

exports.deleteUserEducation = async (req, res) => {
  const userId = req.user._id.toString();
  const { id } = req.params;
  try {
    const user = await User.findById(userId).select("education");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const eduIndex = user.education.findIndex(
      (edu) => edu._id.toString() === id
    );
    if (eduIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Education not found" });
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { education: { _id: id } },
    });
    return res.status(200).json({
      success: true,
      message: "Education details deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting education details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.updateSkills = async (req, res) => {
  const userId = req.user._id.toString();
  let { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    console.log("Skills cannot be empty!");
    return res.status(400).json({
      success: false,
      message: "Skills must be provided as a non-empty array",
    });
  }

  // Trim each skill in the array
  skills = skills.map((skill) => skill.trim()).filter((skill) => skill !== "");

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the new skills are different from the existing ones
    const existingSkills = user.skills.map((s) => s.toLowerCase());
    const newSkillsLower = skills.map((s) => s.toLowerCase());

    // Check if there are no changes
    if (
      existingSkills.length === newSkillsLower.length &&
      existingSkills.every((skill) => newSkillsLower.includes(skill))
    ) {
      return res.status(400).json({
        success: false,
        message: "No changes detected in the skills",
      });
    }

    // Update user's skills
    user.skills = skills;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Skills updated successfully",
      data: user.skills,
    });
  } catch (error) {
    console.error("Error updating skills:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
