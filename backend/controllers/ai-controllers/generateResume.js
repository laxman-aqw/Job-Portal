const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate resume based on user inputs
exports.generateResume = async (req, res) => {
  try {
    const user = req.user;
    const {
      jobTitle,
      yearsOfExperience,
      keySkills,
      achievements,
      education,
      certifications,
      customInstructions,
    } = req.body;
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    if (!jobTitle || !yearsOfExperience) {
      return res.status(400).json({
        success: false,
        message: "Job title and years of experience are required.",
      });
    }

    const prompt = `
      Generate a professional resume for a ${jobTitle} position with ${yearsOfExperience} years of experience.
      
      User Information:
      - Name: ${user.firstName + " " + user.lastName || "Your Name"}
      - Email: ${user.email}
      - Industry: ${user.industry || "Not specified"}
      ${
        user.skills?.length ? `- Current Skills: ${user.skills.join(", ")}` : ""
      }
      
      Additional Information:
      ${keySkills ? `- Key Skills: ${keySkills}` : ""}
      ${achievements ? `- Key Achievements: ${achievements}` : ""}
      ${education ? `- Education: ${education}` : ""}
      ${certifications ? `- Certifications: ${certifications}` : ""}
      ${
        customInstructions ? `- Custom Instructions: ${customInstructions}` : ""
      }
      
      Generate a comprehensive, professional resume in the following JSON format:
      {
        "personalInfo": {
          "name": "string",
          "email": "string",
          "phone": "string (optional)",
          "location": "string (optional)",
          "linkedin": "string (optional)"
        },
        "summary": "string (professional summary)",
        "experience": [
          {
            "title": "string",
            "company": "string",
            "duration": "string",
            "description": "string"
          }
        ],
        "education": [
          {
            "degree": "string",
            "institution": "string",
            "year": "string"
          }
        ],
        "skills": ["string"],
        "achievements": ["string"],
        "certifications": ["string"]
      }
      
      Make the resume relevant to the job title and experience level. Include realistic but impressive achievements and responsibilities.
      Return ONLY the JSON format without any additional text or markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response
      .text()
      .replace(/```(?:json)?\n?/g, "")
      .trim();

    const resume = JSON.parse(responseText);

    res.status(200).json({
      success: true,
      message: "Resume generated successfully",
      resume: resume,
    });
  } catch (error) {
    console.error("Error generating resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate resume",
      error: error.message,
    });
  }
};

// Save generated resume
exports.saveResume = async (req, res) => {
  try {
    const user = req.user;
    const { resumeData, resumeName } = req.body;

    if (!user || !resumeData) {
      return res.status(400).json({
        success: false,
        message: "User and resume data are required.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume saved successfully",
      //   resume: savedResume
    });
  } catch (error) {
    console.error("Error saving resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save resume",
      error: error.message,
    });
  }
};
