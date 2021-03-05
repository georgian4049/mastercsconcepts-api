const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Core_Theory_Content = require("../../models/CoreTheoryContent");

router.get("/", async (req, res) => {
  try {
    const { courseArea, courseSubArea, materialCategory } = req.query;
    console.log(req.query);
    const coreTheoryContent = await Core_Theory_Content.find({
      courseArea,
      courseSubArea,
      materialCategory,
    });
    return res.status(200).json({ data: coreTheoryContent });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.post("/", async (req, res) => {
  try {
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    const id = req.body.title + "-" + req.body.authorUsername;
    const exists = await Core_Theory_Content.findOne({ _id: id });
    req.body._id = id;
    if (!exists) {
      let core_theory_content = new Core_Theory_Content(req.body);
      const a = await core_theory_content.save();
      console.log(a);
      return res
        .status(200)
        .json({ message: `Content saved successfully. Content -> ${a}` });
    } else {
      return res.status(201).json({
        data: "You have already submitted similar content. Please change title",
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: error.message } });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      if (req.query.action === "add") {
        await Core_Theory_Content.findOneAndUpdate(
          { optionName: req.body.optionName },
          {
            $push: {
              items: {
                name: req.body.newValue,
                displayName: req.body.newValue,
              },
            },
          }
        );
      } else if (req.query.action === "delete") {
        await Core_Theory_Content.findOneAndUpdate(
          { optionName: req.body.optionName },
          { $pull: { items: { name: req.body.deleteValue } } }
        );
      } else if (req.query.action === "replace") {
        await Core_Theory_Content.findOneAndUpdate(
          { optionName: req.body.optionName },
          { $set: { items: req.body.values } }
        );
      }
      const coreTheoryContent = await Core_Theory_Content.find();
      return res.status(200).json({ data: coreTheoryContent });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

module.exports = router;
