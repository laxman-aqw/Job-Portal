const { Webhook } = require("svix");
const mongoose = require("mongoose");
const User = require("../models/User");

// API controller function to manage Clerk user with database
const clerkWebHook = async (req, res) => {
  try {
    // Create a svix instance with Clerk webhook secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    console.log("Received Headers:", req.headers);
    console.log("Received Body:", req.body);

    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // console.log(process.env.CLERK_WEBHOOK_SECRET);
    // Verifying headers
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting data from the request body
    const { data, type } = req.body;

    // Switch case for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.status(201).json({ message: "User created successfully!" });
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.status(200).json({ message: "User updated successfully" });
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.status(200).json({ message: "User deleted successfully" });
        break;
      }
      default:
        res.status(400).json({ success: false, message: "Unknown event type" });
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Webhook error" });
  }
};

module.exports = { clerkWebHook };
