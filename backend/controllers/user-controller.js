const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const Application = require("../models/Application");
const Job = require("../models/Job");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const e = require("express");
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
  } = req.body;
  const imageFile = req.file;
  if (!description) {
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

exports.getExperienceById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id.toString();
  // const { jobTitle, companyName, startDate, endDate, description } = req.body;
  // if (!jobTitle || !companyName || !startDate || !description) {
  //   console.log("fields are required");
  //   return res.status(400).json({
  //     success: false,
  //     message:
  //       "Job title, company name, start date, and description are required",
  //   });
  // }
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
      exps,
    });
  } catch (error) {
    console.error("Error fetching user's job experience:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// {
//   "firstName": "Laxman",
//   "lastName": "Rumba",
//   "education": [
//     {
//       "_id": "67acb56608c6636bd8b08080",
//       "degree": "Bachelor of Science",
//       "fieldOfStudy": "Computer Science",
//       "institutionName": "Stanford University",
//       "startDate": "2016-08-15T00:00:00.000Z",
//       "endDate": "2020-05-20T00:00:00.000Z",
//       "grade": "3.8 GPA"
//     },
//     {
//       "_id": "67acb56608c6636bd8b08081",
//       "degree": "Master of Science",
//       "fieldOfStudy": "Software Engineering",
//       "institutionName": "MIT",
//       "startDate": "2021-08-15T00:00:00.000Z",
//       "endDate": "2023-05-20T00:00:00.000Z",
//       "grade": "4.0 GPA"
//     }
//   ],
//   "experience": [
//     {
//       "_id": "67acb56608c6636bd8b08082",
//       "jobTitle": "Software Engineer",
//       "companyName": "Tech Corp",
//       "startDate": "2018-06-01T00:00:00.000Z",
//       "endDate": "2021-08-15T00:00:00.000Z",
//       "description": "Developed web applications using React, Node.js, and MongoDB."
//     },
//     {
//       "_id": "67acb56608c6636bd8b08083",
//       "jobTitle": "Senior Software Engineer",
//       "companyName": "Innovative Solutions",
//       "startDate": "2021-09-01T00:00:00.000Z",
//       "description": "Designed and implemented scalable microservices architecture."
//     }
//   ],
//   "skills": [
//     "JavaScript",
//     "React.js",
//     "Node.js",
//     "MongoDB",
//     "Express.js",
//     "Tailwind CSS",
//     "GraphQL",
//     ".Net",
//     "TypeScript"
//   ],
//   "description": "Motivated and detail-oriented BCA student with a strong foundation in full-stack web development using the MERN stack. Passionate about building scalable applications, problem-solving, and continuously learning new technologies. Seeking an opportunity to contribute my technical and analytical skills in a professional software development role.",
//   "phone": "9818818181",
//   "address": "Naikap, Kathmandu",
//   "githubProfile": "https://github.com/laxman-aqw",
//   "linkedInProfile": "https://www.linkedin.com/in/laxman-rumba/",
//   "gender": "Male"
// }
