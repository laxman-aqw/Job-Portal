const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");
const JobRoleCategory = require("../models/JobRoleCategory");
const { classifyJob } = require("../utils/naiveBayes");
const { fetchAndExtractText } = require("../utils/resumeExtraction");
const { htmlToText } = require("html-to-text");

// const { stripHtml } = require("string-strip-html");
// const natural = require("natural");
// const sw = require("stopword");

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });
    if (jobs.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Jobs fetched succesfully", jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id).populate({
      path: "companyId",
      select: "-password",
    });
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "job fetch by id succesful", job });
  } catch (error) {
    console.error("Error fetching job by id:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const companyId = req.company._id;
  const { title, description, level, deadline, location, salary, category } =
    req.body;

  if (!title || !level || !description || !location || !salary || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }
    const job = await Job.findById(id);

    if (!job) {
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

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          level,
          location,
          deadline,
          salary,
          category,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.addJobRoleCategory = async (req, res) => {
  const { category, text } = req.body;
  try {
    const newRoleCategory = new JobRoleCategory({ category, text });
    await newRoleCategory.save();
    res.status(201).json({
      success: true,
      message: "New Job Role Category added succesfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// exports.recommendJobs = async (req, res) => {
//   const { text } = req.body;
//   try {
//     const scores = classifyJob(text);
//     const sortedCategories = Object.keys(scores).sort(
//       (a, b) => scores[b] - scores[a]
//     );
//     const topCategory = sortedCategories[0];
//     const secondCategory = sortedCategories[1];
//     const thirdCategory = sortedCategories[2];

//     let recommendedJobs = await Job.find({
//       roleCategory: {
//         $in: [new RegExp(topCategory, "i")],
//       },
//       visible: true,
//     })
//       .populate({
//         path: "companyId",
//         select: "-password ",
//       })
//       .sort({ relevanceScore: -1 });

//     if (recommendedJobs.length < 12) {
//       const secondCategoryJobs = await Job.find({
//         roleCategory: {
//           $in: [new RegExp(secondCategory, "i")],
//         },
//         visible: true,
//       })
//         .populate({
//           path: "companyId",
//           select: "-password ",
//         })
//         .sort({ relevanceScore: -1 });

//       recommendedJobs = [...recommendedJobs, ...secondCategoryJobs];

//       if (recommendedJobs.length < 12) {
//         const thirdCategoryJobs = await Job.find({
//           roleCategory: {
//             $in: [new RegExp(thirdCategory, "i")],
//           },
//           visible: true,
//         })
//           .populate({
//             path: "companyId",
//             select: "-password ",
//           })
//           .sort({ relevanceScore: -1 });

//         recommendedJobs = [...recommendedJobs, ...thirdCategoryJobs];
//       }
//     }

//     res.status(200).json({
//       success: true,
//       message: "Recommended jobs fetched",
//       jobs: recommendedJobs,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

exports.recommendJobs = async (req, res) => {
  const { text } = req.body;
  console.log(text);
  try {
    const userScores = classifyJob(text);
    const userSortedCategories = Object.keys(userScores).sort(
      (a, b) => userScores[b] - userScores[a]
    );

    const topCategory = userSortedCategories[0];
    console.log("The top category is: ", topCategory);

    const allJobs = await Job.find({
      visible: true,
      deadline: { $gt: new Date() },
    }).populate({
      path: "companyId",
      select: "-password",
    });

    let matchedJobs = [];

    // for (const job of allJobs) {
    //   const htmlContent = job.description;

    //   const plainText = await generateClassifiableJobDescription(htmlContent);
    //   const jobScores = classifyJob(plainText);
    //   const jobSortedCategories = Object.keys(jobScores).sort(
    //     (a, b) => jobScores[b] - jobScores[a]
    //   );
    //   console.log(
    //     "The top job from recommendation 1 is:",
    //     jobSortedCategories[0]
    //   );
    //   const topJobCategory = jobSortedCategories[0];
    //   if (jobSortedCategories[0] === topCategory) {
    //     matchedJobs.push({
    //       ...job._doc,
    //       matchScore: userScores[topJobCategory] || 0,
    //     });
    //   }
    // }

    // Sort by custom relevance match score

    for (const job of allJobs) {
      const htmlContent = job.description;
      const plainText = htmlToText(htmlContent, {
        wordwrap: 1000,
        selectors: [
          { selector: "a", options: { ignoreHref: true } }, // Skip hrefs if needed
        ],
      });
      // console.log("the job content is:", plainText);
      // const plainText = await generateClassifiableJobDescription(htmlContent);
      const jobScores = classifyJob(plainText);
      const jobSortedCategories = Object.keys(jobScores).sort(
        (a, b) => jobScores[b] - jobScores[a]
      );

      const topJobCategory = jobSortedCategories[0];

      if (topJobCategory === topCategory) {
        matchedJobs.push({
          ...job._doc,
          matchScore: userScores[topJobCategory] || 0,
        });
      }
    }

    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Take top 12
    const topMatchedJobs = matchedJobs.slice(0, 12);

    res.status(200).json({
      success: true,
      message: "Recommended jobs fetched",
      jobs: topMatchedJobs,
    });
  } catch (error) {
    console.error("errror from recommend jobs", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.parseResume = async (req, res, next) => {
  const { pdfUrl } = req.body;
  if (!pdfUrl) {
    return res
      .status(400)
      .json({ success: false, message: "pdfUrl is required" });
  }
  // console.log(pdfUrl);
  try {
    // const unfilteredText = await fetchAndExtractText(pdfUrl);
    // const text = await fetchAndExtractText(pdfUrl);
    // console.log("the unfiltered text is:", unfilteredText);
    // const text = await generateClassifiableSkills(unfilteredText);
    // console.log("text from generateClassifiable skills:", text);
    const text = await fetchAndExtractText(pdfUrl);

    // const processedText = preprocessResume(rawText);
    // console.log("Preprocessed text:", processedText);
    // const text = stripHtml(rawText).result;
    res.status(200).json({
      success: true,
      message: "resume data parsed",
      text,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const generateClassifiableSkills = async (resumeText) => {
//   const prompt = `
//     You are an expert resume parser for job classification systems.

//     Given a resume text, extract and return a summary of the candidate's job-related skills, experience, and relevant traits for classification. Do NOT include personal details, education info, certifications, or formatting. Your goal is to clean the resume into a text block that contains only useful features for a Naive Bayes job classifier.

//     Now extract skills and experience summary from the following resume:

//     ${resumeText}

//     return the summary of skills and experience as a plain string in a paragraph.
//   `;

//   const result = await model.generateContent(prompt);
//   const textResult = result.response.text().trim();
//   return textResult.replace(/^["']|["']$/g, ""); // remove quotes if any
// };
// const generateClassifiableJobDescription = async (jobDescription) => {
//   const prompt = `
//     You are an expert jop description parser for job classification systems.

//     Given a job description, extract and return a summary of the job. Your goal is to clean the job description into a text block that contains only useful features for a Naive Bayes job classifier.

//     Now extract keypoints summary from the following resume:

//     ${jobDescription}

//     return the summary of skills and experience as a plain string in a paragraph.
//   `;

//   const result = await model.generateContent(prompt);
//   const textResult = result.response.text().trim();
//   return textResult.replace(/^["']|["']$/g, ""); // remove quotes if any
// };
