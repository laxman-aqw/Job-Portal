const mongoose = require("mongoose");
const Job = require("../models/Job");
const Company = require("../models/Company");
const JobRoleCategory = require("../models/JobRoleCategory");
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
    res
      .status(201)
      .json({
        success: true,
        message: "New Job Role Category added succesfully",
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
