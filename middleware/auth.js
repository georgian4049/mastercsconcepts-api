const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization Denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.identity;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid Token" });
    throw err;
  }
};
