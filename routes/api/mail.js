const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Mail = require("../../models/Mail");

router.get("/", auth, async (req, res) => {
  try {
    // console.log(req.user.email);
    let mails = [];
    if (req.user.role === "client") {
      mails = await Mail.find({ user: req.user.email }).sort(
        "-latestUpdateDate"
      );
    } else {
      mails = await Mail.find().sort("-latestUpdateDate");
    }
    return res.status(200).json({ data: mails });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const exists = await Mail.findOne({ _id: req.body.id });
    if (!exists) {
      let mailBody = new Mail({
        latestUpdateDate: new Date(),
        _id: req.body.id,
        messages: req.body.message,
        seen: false,
        requestStatus: req.body.requestStatus,
        user: req.user.email,
      });
      await mailBody.save();
      return res.status(200).json({ data: "Mail sent successfully" });
    } else {
      await Mail.findByIdAndUpdate(
        req.body.id,
        {
          latestUpdateDate: new Date(),
          seen: false,
          $push: { messages: req.body.message },
        },
        { upsert: true, new: true }
      );
      return res.status(200).json({ data: "Mail sent successfully" });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.put("/read/", auth, async (req, res) => {
  try {
    await Mail.findByIdAndUpdate(req.query.id, {
      seen: true,
    });
    return res.status(200).json({ message: "read success" });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

module.exports = router;
