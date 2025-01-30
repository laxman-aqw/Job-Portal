const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  await mongoose
    .connect(process.env.DatabaseURI)
    .then(() => {
      console.log("MongoDB Connected...");
    })
    .catch((err) => {
      console.log("Error connecting");
    });
};

module.exports = connectDB;
