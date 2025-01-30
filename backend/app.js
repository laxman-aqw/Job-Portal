const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/company-routes");
const { clerkWebHook } = require("./controllers/webhooks");
const connectCloudinary = require("./config/cloudinary");
require("dotenv").config();

const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World from laxman");
});

app.post("/webhooks", clerkWebHook);
app.use("/api/company", companyRoutes);

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
