const mongoose = require("mongoose");
const Job = require("../models/Job");

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
