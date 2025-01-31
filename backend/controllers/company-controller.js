//register new company
const bcrypt = require("bcrypt");
const CompanyModel = require("../models/Company");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const Company = require("../models/Company");

//create a company
exports.registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res
      .status(404)
      .json({ success: false, message: "fields are missing" });
  }

  try {
    const existingCompany = await CompanyModel.findOne({ email: email });
    if (existingCompany) {
      return res
        .status(409)
        .json({ success: false, message: "email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const newCompany = await CompanyModel.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully!",
      company: {
        name: newCompany.name,
        email: newCompany.email,
        image: newCompany.image,
      },
      token: generateToken(newCompany._id),
    });
  } catch (error) {
    console.error("Error checking existing company:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res
        .status(401)
        .json({ success: false, message: "Company not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (isPasswordValid) {
      const token = generateToken(company._id);
      res.status(200).json({
        success: true,
        message: "login succesful",
        company: {
          name: company.name,
          email: company.email,
          image: company.image,
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

exports.getCompanyData = async (req, res) => {};
exports.postJob = async (req, res) => {};

exports.getCompanyJobApplicants = async (req, res) => {};

exports.getCompanyPostedJobs = async (req, res) => {};

exports.changeJobApplicationStatus = async (req, res) => {};

exports.changeVisibility = async (req, res) => {};
