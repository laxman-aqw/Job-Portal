require("dotenv").config();

const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "RojgarChowk",
    link: "http://localhost:8080/",
  },
});

exports.registerMail = async (req, res) => {
  try {
    const { name, email, text, subject } = req.body;

    // HTML content for the email
    const emailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f7fc;
              color: #333333;
              padding: 20px;
            }
            .email-container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              width: 80%;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              margin-bottom: 30px;
            }
            .email-header h1 {
              color: #4A90E2;
            }
            .email-content {
              line-height: 1.6;
            }
            .email-footer {
              margin-top: 30px;
              font-size: 14px;
              text-align: center;
              color: #777777;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background-color: #22BC66;
              color: white;
              font-size: 16px;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              margin-top: 20px;
            }
            .button:hover {
              background-color: #1e9a52;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Welcome to RojgarChowk, ${name}!</h1>
            </div>
            <div class="email-content">
              <p>${
                text ||
                "We are excited to have you join us. Let's get you started!"
              }</p>
              <p>To begin, simply click the button below to get started:</p>
              <a href="http://localhost:5173/" class="button">Get Started</a>
            </div>
            <div class="email-footer">
              <p>If you have any questions or need assistance, feel free to contact us at any time.</p>
              <p>Need help? <a href="mailto:support@rojgarchowk.com">Contact us</a>.</p>
              <p>Best regards,</p>
              <p>The RojgarChowk Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Plaintext version of the email
    const emailText = `
      Hello ${name},

      ${text || "Welcome to RojgarChowk! We are excited to have you onboard."}

      To get started, simply click the link below:
      http://localhost:5173/

      If you have any questions or need assistance, feel free to contact us at any time.

      Best regards,
      The RojgarChowk Team
    `;

    // Construct the email message
    const message = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || "Registration successful",
      text: emailText,
      html: emailBody,
    };

    // Send the email
    await transporter.sendMail(message);

    // Respond with success
    res.status(200).json({
      success: true,
      message: "A registration email has been sent to your email address.",
    });
  } catch (err) {
    console.error("Error sending registration email:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send registration email. Please try again later.",
      error: err.message,
    });
  }
};
