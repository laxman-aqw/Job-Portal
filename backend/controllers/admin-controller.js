const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job");
const Application = require("../models/Application");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const e = require("express");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    const payload = {
      id: admin._id,
      email: admin.email,
    };

    if (isPasswordValid) {
      const token = generateToken(payload);
      // console.log(token);
      res.status(200).json({
        success: true,
        message: "login succesful",
        admin: {
          email: admin.email,
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

exports.addAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(404)
      .json({ success: false, message: "fields are missing" });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    const existingAdmin = await Admin.findOne({ email: email });
    const existingCompany = await Company.findOne({ email: email });
    if (existingUser || existingCompany || existingAdmin) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const payload = {
      id: newAdmin._id,
      email: newAdmin.email,
    };

    res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
      admin: {
        email: newAdmin.email,
      },
      token: generateToken(payload),
    });
  } catch (error) {
    console.error("Error checking existing admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Users found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Users fetched succesfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getTotalJobSeekers = async (req, res) => {
  try {
    const jobSeekersByMonth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Optional: Format for frontend graphing
    const formatted = jobSeekersByMonth.map((entry) => {
      const date = new Date(entry._id.year, entry._id.month - 1);
      return {
        name: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        total: entry.total,
      };
    });

    res.status(200).json({
      success: true,
      message: "Monthly job seeker data fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching monthly job seekers:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.getTotalRecruiters = async (req, res) => {
  try {
    const recruitersByMonth = await Company.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Optional: Format for frontend graphing
    const formatted = recruitersByMonth.map((entry) => {
      const date = new Date(entry._id.year, entry._id.month - 1);
      return {
        name: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        total: entry.total,
      };
    });

    res.status(200).json({
      success: true,
      message: "Monthly recruiters data fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching monthly recruiters:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getMonthlyJobPosts = async (req, res) => {
  try {
    const jobsByMonth = await Job.aggregate([
      {
        $addFields: {
          createdDate: { $toDate: "$createdAt" }, // Ensure coercible date
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdDate" },
            month: { $month: "$createdDate" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const formatted = jobsByMonth.map((entry) => {
      const date = new Date(entry._id.year, entry._id.month - 1);
      return {
        name: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        total: entry.total,
      };
    });

    res.status(200).json({
      success: true,
      message: "Monthly job post data fetched successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching job post data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getApplicationStatusCounts = async (req, res) => {
  try {
    const statusCounts = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    // Optional: Normalize result to always include all statuses with 0 if none found
    const statuses = ["Pending", "Accepted", "Rejected"];
    const counts = statuses.reduce((acc, status) => {
      const found = statusCounts.find((s) => s._id === status);
      acc[status.toLowerCase()] = found ? found.total : 0;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: "Application status counts fetched successfully",
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching application status counts:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getTopCompaniesByJobPosts = async (req, res) => {
  try {
    const topCompanies = await Job.aggregate([
      {
        $group: {
          _id: "$companyId",
          totalJobs: { $sum: 1 },
        },
      },
      {
        $sort: { totalJobs: -1 },
      },
      {
        $limit: 5,
      },
      {
        // Lookup company details
        $lookup: {
          from: "companies", // MongoDB collection name for companies (usually plural lowercase)
          localField: "_id",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $project: {
          _id: 0,
          companyId: "$_id",
          companyName: "$company.name",
          totalJobs: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Top companies fetched successfully",
      data: topCompanies,
    });
  } catch (error) {
    console.error("Error fetching top companies:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
