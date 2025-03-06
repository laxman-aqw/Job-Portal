//register new company
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const generateToken = require("../utils/generateToken");
const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const nodemailer = require("nodemailer");
exports.registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res
      .status(404)
      .json({ success: false, message: "fields are missing" });
  }

  try {
    const existingCompany = await Company.findOne({ email: email });
    const existingUser = await User.findOne({ email: email });
    if (existingCompany || existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const newCompany = await Company.create({
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New registration",
      text: "You have successfully registered!",
      html: `<p>You have successfully registered!</p>`,
    };

    await transporter.sendMail(message);

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

//login
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

//validate email
exports.validateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (company) {
      return res.status(200).json({ success: false, exists: true });
    }
    res.status(200).json({ success: true, exists: false });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getCompanyData = async (req, res) => {
  try {
    //if company is logged in or not
    if (!req.company) {
      return res.status(404).json({
        success: false,
        message: "Company data not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company data fetched successfully",
      company: req.company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching company data",
      error: error.message,
    });
  }
};

exports.postJob = async (req, res) => {
  const { title, description, level, deadline, location, salary, category } =
    req.body;

  if (!title || !level || !description || !location || !salary || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const companyId = req.company._id;

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

    await Company.findByIdAndUpdate(
      companyId,
      { $push: { jobs: newJob._id } },
      { new: true }
    );

    res
      .status(201)
      .json({ success: true, message: "Job created successfully", newJob });
  } catch (error) {
    console.error("Error creating new job:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getCompanyJobApplicants = async (req, res) => {
  const companyId = req.company._id.toString();

  try {
    const applications = await Application.find({ companyId })
      .populate("userId", "firstName lastName image resume")
      .populate("jobId", "location title category level salary")
      .exec();

    res.status(200).json({
      success: true,
      applications,
      message: "Job Applicants fetched succesfully",
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getCompanyPostedJobs = async (req, res) => {
  const companyId = req.company._id;
  try {
    const jobs = await Job.find({ companyId });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await Application.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );

    res
      .status(200)
      .json({ success: true, message: "Jobs fetched successfully", jobsData });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.changeJobApplicationStatus = async (req, res) => {
  const { id, status } = req.body;
  const companyId = req.company._id.toString();
  try {
    const application = await Application.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    if (application.companyId.toString() !== companyId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this application",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Application status changed successfully",
      application,
    });
  } catch (error) {
    console.error("Error changing application status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.changeVisibility = async (req, res) => {
  const { id } = req.body;

  const companyId = req.company._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      //0.2
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id); //1sec

    if (!job) {
      //0.1
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this job",
      });
    }

    job.visible = !job.visible;

    await job.save();
    res.status(200).json({
      success: true,
      message: "Job visibility updated succesfully",
      job,
    });
  } catch (error) {
    console.error("Error changing job visibility:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getCompanyDataById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid company ID" });
  }
  try {
    const company = await Company.findById(id)
      .populate({
        path: "jobs",
        populate: { path: "companyId" },
      })
      .select("-password");
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Company data fetched by id succesfully",
      company,
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateCompanyData = async (req, res) => {
  const companyId = req.company._id;
  const { name, description } = req.body;

  const imageFile = req.file;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ success: false, message: "Description is required" });
  }
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    let imageUrl = company.image;
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = imageUpload.secure_url;
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $set: { name, description, image: imageUrl } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Company data updated successfully",
      updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
