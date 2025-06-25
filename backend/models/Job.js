const mongoose = require("mongoose");
const Company = require("./Company");
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    // roleCategory: { type: String, required: true },
    level: { type: String, required: true },
    salary: { type: Number, required: true },
    deadline: {
      type: Date,
      required: true,
      default: () =>
        new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    },
    visible: { type: Boolean, required: true, default: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
