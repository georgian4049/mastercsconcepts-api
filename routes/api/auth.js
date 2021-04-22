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
        username: user.username,
      };

      const token = jwt.sign({ identity: payload }, config.get("jwtSecret"), {
        algorithm: "HS256",
      });
      return res.status(200).json({
        access_token: token,
        username: user.username,
        name: user.firstName + " " + user.lastName,
        likedContentsId: user.likedContentsId,
        commentedContentsId: user.commentedContentsId,
      });
    } catch (error) {
      return res.status(500).json({ errors: { message: "Server Error" } });
    }
  }
);

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;

  try {
    if (!(email && password && firstName && lastName && username)) {
      return res.status(400).json({ errors: { message: "Missing data" } });
    }
    let emailExist = await User.findOne({ email });
    let usernameExist = await User.findOne({ username });
    if (emailExist) {
      return res.status(400).json({ errors: { message: "Email Exists" } });
    }
    if (usernameExist) {
      return res.status(401).json({ errors: { message: "Username Exists" } });
    }
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    let user = new User({
      email,
      username,
      firstName,
      lastName,
      password: pass,
    });
    await user.save();
    const payload = {
      username: user.username,
    };

    const token = jwt.sign({ identity: payload }, config.get("jwtSecret"), {
      algorithm: "HS256",
    });
    return res.status(200).json({
      access_token: token,
      username: username,
      name: firstName + " " + lastName,
      likedContentsId: 0,
      commentedContentsId: 0,
    });
  } catch (error) {
    return res.status(500).json({ errors: { message: "Server Error" } });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const inititalToken = req.body.token;
    const { identity } = jwt.decode(inititalToken, config.get("jwtSecret"));
    const { username } = identity;
    let user = await User.findOne({ username });
    if (user) {
      const payload = {
        username: user.username,
      };
      const token = jwt.sign({ identity: payload }, config.get("jwtSecret"), {
        algorithm: "HS256",
      });
      return res.status(200).json({
        access_token: token,
        username: user.username,
        name: user.firstName + " " + user.lastName,
        likedContentsId: user.likedContentsId,
        commentedContentsId: user.commentedContentsId,
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
