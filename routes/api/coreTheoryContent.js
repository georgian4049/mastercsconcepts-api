const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Core_Theory_Content = require("../../models/CoreTheoryContent");
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const { courseArea, courseSubArea, materialCategory } = req.query;
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

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.username !== req.body.authorUsername) {
      return res
        .status(401)
        .json({ errors: { message: "It seems some trick has hapenned" } });
    }
    const exists = await Core_Theory_Content.findOne({
      title: req.body.title,
      authorUsername: req.body.authorUsername,
    });
    if (!exists) {
      let core_theory_content = new Core_Theory_Content(req.body);
      await core_theory_content.save();
      return res.status(200).json({ message: `Content saved successfully.` });
    } else {
      return res
        .status(400)
        .json({ errors: { message: "Similar Content Already exists" } });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: error.message } });
  }
});

router.put("/", auth, async (req, res) => {
  try {
    if (req.user.username !== req.body.authorUsername) {
      return res
        .status(401)
        .json({ errors: { message: "It seems some trick has hapenned" } });
    }
    const exists = await Core_Theory_Content.findOne({ _id: req.body._id });
    if (exists) {
      await Core_Theory_Content.findByIdAndUpdate(req.body._id, req.body);
      return res.status(200).json({ message: `Content Updated successfully.` });
    } else {
      return res.status(400).json({
        errors: { message: "No Such Content exists. Wrong Update Call" },
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: error.message } });
  }
});

router.delete("/delete/:_id", auth, async (req, res) => {
  try {
    const _id = req.params._id;
    const exists = await Core_Theory_Content.findOne({
      _id: _id,
      authorUsername: req.user.username,
    });
    if (exists) {
      await Core_Theory_Content.findByIdAndDelete({ _id: _id });
      return res.status(200).json({ message: `Content Deleted successfully.` });
    } else {
      return res.status(400).json({
        errors: {
          message: "It seems you tried to delete someone else's contribution",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: error.message } });
  }
});

router.post("/like/:_id", auth, async (req, res) => {
  try {
    const _id = req.params._id;
    const exists = await Core_Theory_Content.findOne({
      _id: _id,
      authorUsername: req.user.username,
    });
    if (exists) {
      await Core_Theory_Content.findByIdAndDelete({ _id: _id });
      return res.status(200).json({ message: `Content Deleted successfully.` });
    } else {
      return res.status(400).json({
        errors: {
          message: "It seems you tried to delete someone else's contribution",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: error.message } });
  }
});

router.post(
  "/bookmark/:courseArea/:courseSubArea/:materialCategory/:_id",
  auth,
  async (req, res) => {
    try {
      const { username } = req.user;
      const { _id } = req.params;
      let user = await User.findOne({ username });
      if (!user) {
        return res
          .status(401)
          .json({ errors: { message: "Unauthorized Access" } });
      }
      const exists = await Core_Theory_Content.findOne({ _id });
      if (!exists) {
        return res.status(400).json({
          errors: { message: "No Such Content exists" },
        });
      }
      await User.findOneAndUpdate({ username }, [
        {
          $set: {
            bookmarked: {
              $cond: {
                if: {
                  $ne: [{ $type: "$bookmarked" }, "array"],
                },
                then: [_id],
                else: {
                  $cond: [
                    {
                      $in: [_id, "$bookmarked"],
                    },
                    {
                      $setDifference: ["$bookmarked", [_id]],
                    },
                    {
                      $concatArrays: ["$bookmarked", [_id]],
                    },
                  ],
                },
              },
            },
          },
        },
      ]);

      await Core_Theory_Content.findByIdAndUpdate(_id, [
        {
          $set: {
            bookmarkedBy: {
              $cond: {
                if: {
                  $ne: [{ $type: "$bookmarkedBy" }, "array"],
                },
                then: [username],
                else: {
                  $cond: [
                    {
                      $in: [username, "$bookmarkedBy"],
                    },
                    {
                      $setDifference: ["$bookmarkedBy", [username]],
                    },
                    {
                      $concatArrays: ["$bookmarkedBy", [username]],
                    },
                  ],
                },
              },
            },
          },
        },
      ]);

      return res.status(200).json({ message: `Bookmarked successfully.` });
    } catch (error) {
      return res.status(500).json({ errors: { message: error.message } });
    }
  }
);

module.exports = router;
