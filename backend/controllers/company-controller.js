//register new company
const bcrypt = require("bcrypt");
const CompanyModel = require("../models/Company");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const Company = require("../models/Company");
const Job = require("../models/Job");
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

    const payload = {
      id: newCompany._id,
      email: newCompany.email,
      name: newCompany.name,
      image: newCompany.image,
    };

    res.status(201).json({
      success: true,
      message: "Company registered successfully!",
      company: {
        name: newCompany.name,
        email: newCompany.email,
        image: newCompany.image,
      },
      token: generateToken(payload),
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

    const payload = {
      id: company._id,
      email: company.email,
      name: company.name,
      image: company.image,
    };

    if (isPasswordValid) {
      const token = generateToken(payload);
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
exports.postJob = async (req, res) => {
  const { title, description, level, deadline, location, salary, category } =
    req.body;

  if (
    !title ||
    !level ||
    !description ||
    !deadline ||
    !location ||
    !salary ||
    !category
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const companyId = req.company._id;
  // console.log(companyId, title, description, deadline, location, salary);

  try {
    const newJob = await Job.create({
      title,
      description,
      deadline,
      location,
      salary,
      level,
      category,
      companyId,
    });
    res
      .status(201)
      .json({ success: true, message: "Job created successfully", newJob });
  } catch (error) {
    console.error("Error creating new job:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getCompanyJobApplicants = async (req, res) => {};

exports.getCompanyPostedJobs = async (req, res) => {};

exports.changeJobApplicationStatus = async (req, res) => {};

exports.changeVisibility = async (req, res) => {};
