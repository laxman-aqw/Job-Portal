const { Webhook } = require("svix");

const mongoose = require("mongoose");

const User = require("../models/User");

//api controller function to manage clerk user with database
export const clerkWebHook = async (req, res) => {
  try {
    //create a svix indtance with clerk webhook secret
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //verifiying headers
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    //getting data from the userbody
    const { data, type } = req.body;

    //   switch case for different events
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
        res.json({});
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(userData.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Web hooks error" });
  }
};
