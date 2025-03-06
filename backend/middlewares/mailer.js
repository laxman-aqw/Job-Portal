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

    // HTML content for the email using TailwindCSS
    const emailBody = `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 text-gray-800 py-10">
          <div class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
            <div class="text-center mb-6">
              <h1 class="text-2xl font-bold text-blue-600">Welcome to RojgarChowk, ${name}!</h1>
            </div>
            <div class="text-lg leading-relaxed">
              <p>${
                text ||
                "We are excited to have you join us. Let's get you started!"
              }</p>
              <p class="mt-4">Click the button below to get started:</p>
              <div class="text-center mt-6">
                <a href="http://localhost:5173/" class="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-600">Get Started</a>
              </div>
            </div>
            <div class="mt-6 text-center text-gray-500 text-sm">
              <p>If you have any questions or need assistance, feel free to contact us.</p>
              <p>Need help? <a href="mailto:support@rojgarchowk.com" class="text-blue-500 hover:underline">Contact us</a>.</p>
              <p class="mt-4">Best regards,</p>
              <p class="font-semibold">The RojgarChowk Team</p>
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
      subject: subject || "Registration Successful",
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
