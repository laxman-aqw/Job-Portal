const express = require("express");
const router = express.Router();
const { generateOTP, verifyOTP } = require("../controllers/authController"); // Import the controller functions

// Route to generate OTP
router.post("/generateOTP/:email", generateOTP); // POST request to generate OTP
router.post("/verifyOTP/:email", verifyOTP);
// Route to verify OTP
// router.post("/verify", verifyOTP); // POST request to verify OTP

module.exports = router;
