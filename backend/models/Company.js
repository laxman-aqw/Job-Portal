const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, required: false },
  jobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Job",
    required: false,
  },
});

module.exports = mongoose.model("Company", companySchema);
