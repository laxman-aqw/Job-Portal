const express = require("express");
const router = express.Router();
const { generateOTP, verifyOTP } = require("../controllers/authController"); // Import the controller functions

// Route to generate OTP
router.post("/generateOTP/:email", generateOTP);
router.post("/verifyOTP/:email", verifyOTP);

module.exports = router;
