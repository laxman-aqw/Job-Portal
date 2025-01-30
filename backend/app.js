const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const connectDB = require("./config/db");

const { clerkWebHook } = require("./controllers/webhooks");

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World from laxman");
});

app.post("/webhooks", clerkWebHook);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
