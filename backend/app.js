const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/company-routes");
const { clerkWebHook } = require("./controllers/webhooks");
const connectCloudinary = require("./config/cloudinary");
require("dotenv").config();
const jobRoutes = require("./routes/job-routes");
const userRoutes = require("./routes/user-routes");
const { clerkMiddleware } = require("@clerk/express");

const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.get("/", (req, res) => {
  res.send("Hello World from laxman");
});

app.use("/api/user", userRoutes);
app.post("/webhooks", clerkWebHook);
app.use("/api/company", companyRoutes);
app.use("/api/job", jobRoutes);

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
