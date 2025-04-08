require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/company-routes");
const axios = require("axios");
const connectCloudinary = require("./config/cloudinary");
require("dotenv").config();
const jobRoutes = require("./routes/job-routes");
const userRoutes = require("./routes/user-routes");
const mailerRoutes = require("./routes/mailer");
const otpRoutes = require("./routes/OTP-routes");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const port = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.DatabaseURI, // Your MongoDB connection string
  collection: "sessions",
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes session
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevents client-side access
    },
  })
);
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);
app.use("/api", mailerRoutes);
app.use("/api/otp", otpRoutes);

const startServer = async () => {
  try {
    await connectCloudinary(); // Ensure Cloudinary is connected
    await connectDB(); // Ensure DB is connected
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1); // Exit if an error occurs during startup
  }
};

startServer();
app.get("/", async (req, res) => {
  res.send("hello");
});
