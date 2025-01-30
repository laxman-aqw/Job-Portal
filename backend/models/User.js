const mongoose = require("mogoose");
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resume: { type: String },
  image: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
