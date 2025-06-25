const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const Company = require("../models/Company");
const Admin = require("../models/Admin");

exports.protectCompany = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("no auth header");
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  }

  const tokenParts = authHeader.split(" ");
  //   console.log(tokenParts);
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  const jwtToken = tokenParts[1];

  //   console.log(jwtToken);
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log(decoded);
    req.company = await Company.findById(decoded.id).select("-password");

    if (!req.company) {
      console.log("No company found");
      return res.status(401).json({
        success: false,
        message: "Company not found, authorization denied",
      });
    }

    next();
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(403)
      .json({ success: false, message: "Not authorized : invalid token" });
  }
};
exports.protectAdmin = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("no auth header");
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  } else {
    // console.log("auth header found", authHeader);
  }

  const tokenParts = authHeader.split(" ");
  //   console.log(tokenParts);
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  const jwtToken = tokenParts[1];

  //   console.log(jwtToken);
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log(decoded);
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found, authorization denied",
      });
    }

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized : invalid token" });
  }
};

exports.protectUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("no auth header");
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied",
    });
  } else {
    // console.log("auth header found", authHeader);
  }

  const tokenParts = authHeader.split(" ");
  //   console.log(tokenParts);
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token format" });
  }

  const jwtToken = tokenParts[1];

  //   console.log(jwtToken);
  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found, authorization denied",
      });
    }

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Not authorized : invalid token" });
  }
};
