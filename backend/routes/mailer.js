const express = require("express");
const router = express.Router();
const mailer = require("../middlewares/mailer");

router.post("/registerMail", mailer.registerMail);
module.exports = router;
