const mongoose = require("mongoose");

const jobRoleCategorySchema = new mongoose.Schema({
  category: {
    type: "string",
    required: true,
  },
  text: {
    type: "string",
    required: true,
  },
});

module.exports = mongoose.model("JobRoleCategory", jobRoleCategorySchema);
