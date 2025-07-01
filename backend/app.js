require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/company-routes");
const axios = require("axios");
const connectCloudinary = require("./config/cloudinary");
const jobRoutes = require("./routes/job-routes");
const userRoutes = require("./routes/user-routes");
const aiRoutes = require("./routes/ai-routes");
const adminRoutes = require("./routes/admin-routes");
const mailerRoutes = require("./routes/mailer");
const otpRoutes = require("./routes/OTP-routes");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const port = process.env.PORT;
const { trainNaiveBayes } = require("./utils/naiveBayes");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.DatabaseURI,
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
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);

const startServer = async () => {
  try {
    await connectCloudinary();
    await connectDB();
    await trainNaiveBayes();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
};

startServer();

require("./controllers/ai-controllers/CronIndustryInsight");
app.get("/", async (req, res) => {
  res.send("hello");
});
