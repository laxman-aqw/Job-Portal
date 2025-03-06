const mongoose = require("mongoose");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const nodemailer = require("nodemailer");

exports.generateOTP = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpExpiryTime = 10 * 60 * 1000;
    const expiresAt = new Date(Date.now() + otpExpiryTime);

    // Save OTP to MongoDB
    const otpEntry = new OTP({
      email: email,
      otp: otp,
      expiresAt: expiresAt,
    });

    await otpEntry.save();
    console.log("OTP generated and saved to database:", otp);

    // Send OTP to email
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
      subject: "Your OTP for registration",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP for registration is <strong>${otp}</strong></p>`,
    };

    await transporter.sendMail(message);

    res.status(200).json({
      success: true,
      message: "OTP has been sent to your email address.",
    });
  } catch (err) {
    console.error("Error generating OTP:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;

  if (!email || !otp) {
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

    res.status(200).json({
      success: true,
      message: "OTP verified successfully and deleted",
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
