const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Application", applicationSchema);
