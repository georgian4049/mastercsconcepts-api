const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Query = require("../../models/Query");

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const similarQueryExist = await Query.findOne({ ...body });

    if (similarQueryExist) {
      return res
        .status(400)
        .json({ errors: { message: "Similar Query Exists" } });
    }
    let new_query = new Query({ ...body, date: new Date() });
    await new_query.save();
    return res
      .status(200)
      .json({ data: "Thanks for your query! We will resolve it soon!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

module.exports = router;
