const express = require("express");
const router = express.Router();

//@route   GET api/user
//@desc    Test route
//@access  Public
router.post("/", (req, res) => res.send("users route"));

module.exports = router;
