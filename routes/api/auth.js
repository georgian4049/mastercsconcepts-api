const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");

router.post(
  "/login",
  [check("email", "Enter email please").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: { message: "Please enter valid email" } });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        //temporary task to add if the user doesnot exist
        // user = new User({
        //   firstName: "Ayush",
        //   lastName: "Shekhar",
        //   password: "ashek",
        //   username: "ashek",
        //   profession: "techno-professional",
        //   interest: ["Big Data", "Machine Learning", "Artificial Intelligence"],
        //   email: "cadet4049@gmail.com",
        // });
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        // await user.save();
        // return res
        //   .status(200)
        //   .json({ message: { message: `Users ${user.username}Added` } });
        //Temporary response
        // return res.status(200).json({ errors: { message: "User Added" } });
        //   //method when we will have API mapped with out ALTI DB
        return res
          .status(400)
          .json({ errors: { message: "Invalid credentials" } });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: { message: "Invalid credentials" } });
      }

      const payload = {
        email: user.email,
      };

      const token = jwt.sign({ identity: payload }, config.get("jwtSecret"), {
        algorithm: "HS256",
      });
      return res.status(200).json({
        access_token: token,
        username: user.username,
        name: user.firstName + " " + user.lastName,
      });
    } catch (error) {
      return res.status(500).json({ errors: { message: "Server Error" } });
    }
  }
);

router.post("/refresh", async (req, res) => {
  try {
    const inititalToken = req.body.token;
    const { identity } = jwt.decode(inititalToken, config.get("jwtSecret"));
    const { email } = identity;
    let user = await User.findOne({ email });
    if (user) {
      const payload = {
        email: user.email,
      };
      const token = jwt.sign({ identity: payload }, config.get("jwtSecret"), {
        algorithm: "HS256",
      });
      return res.status(200).json({
        access_token: token,
        username: user.username,
        name: user.firstName + " " + user.lastName,
      });
    } else {
      return res.status(400).json({
        message: "Please Log in to access content",
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

module.exports = router;
