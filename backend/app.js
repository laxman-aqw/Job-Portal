const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const connectDB = require("./config/db");
const Sentry = require("@sentry/node");
const { clerkWebHook } = require("./controllers/webhooks");
// const companyRoutes = require("./routes/company-routes");
require("./config/instrument");
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World from laxman");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebHook);

// app.use("/api/company", companyRoutes);

Sentry.setupExpressErrorHandler(app);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
