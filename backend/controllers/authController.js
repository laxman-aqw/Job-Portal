const mongoose = require("mongoose");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const Company = require("../models/Company");
const nodemailer = require("nodemailer");
const session = require("express-session");
const generateToken = require("../utils/generateToken");
exports.verifyOTP = async (req, res) => {
  const { otp, name, email, password, image } = req.body;
  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }
  const existingOTP = await OTP.findOne({ email });
  if (!existingOTP) {
    return res
      .status(404)
      .json({ success: false, message: "OTP not found or expired" });
  }

  if (existingOTP.otp !== otp) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }
  if (existingOTP.expiresAt < new Date()) {
    await OTP.deleteOne({ email });
    return res.status(410).json({ success: false, message: "OTP expired" });
  }
  await OTP.deleteOne({ email });
  console.log(`Deleted OTP after successful verification for ${email}`);

  // Save the company to DB
  const newCompany = new Company({
    name,
    email,
    password,
    image,
  });
  await newCompany.save();

  const payload = {
    id: newCompany._id,
    email: newCompany.email,
    name: newCompany.name,
    image: newCompany.image,
  };
  return res.status(201).json({
    success: true,
    message: "Company registered successfully",
    company: {
      name: newCompany.name,
      email: newCompany.email,
      image: newCompany.image,
    },
    token: generateToken(payload),
  });
};

exports.verifyOTPp = async (req, res) => {
  const tempUser = req.session.tempUser;
  console.log(tempUser);
  // Check if session data is missing
  if (!tempUser) {
    return res
      .status(400)
      .json({ success: false, message: "Session expired!" });
  }
  const { otp } = req.body;
  const { name, email, password, image } = tempUser;
  if (!tempUser.email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    // Find OTP entry in the database by email
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check if the OTP has expired
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Check if the OTP matches
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid, delete it from the database after successful verification
    await otpRecord.deleteOne(); // Or you can use otpRecord.deleteOne()
    const newCompany = await Company.create({
      name,
      email,
      password,
      image,
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
      subject: "Your Company Registration is Successful!",
      text: `Dear ${newCompany.name},\n\nCongratulations! Your company has been successfully registered on RojgarChowk.\n\nYou can now start posting job opportunities and connecting with top talent.\n\nIf you need any assistance, feel free to reach out to our support team.\n\nBest regards,\n RojgarChowk Team`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #007bff;">Welcome to RojgarChowk!</h2>
        <p>Dear <strong>${newCompany.name}</strong>,</p>
        <p>Congratulations! Your company has been successfully registered on <strong>RojgarChowk</strong>.</p>
        <p>You can now start posting job opportunities and connecting with top talent.</p>
        <p>If you need any assistance, feel free to reach out to our support team.</p>
        <br>
        <p style="font-weight: bold;">Best regards,</p>
        <p>RojgarChowk Team</p>
      </div>
    `,
    };

    await transporter.sendMail(message);
    res.status(200).json({
      success: true,
      message: "OTP verified and Company registered successfully!",
      company: {
        name: newCompany.name,
        email: newCompany.email,
        image: newCompany.image,
      },
      token: generateToken(payload),
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
