const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorize(req, res, next) {
  const jwToken = req.header("jwToken");

  if (!jwToken) {
    return res.status(401).json({ message: "Access denied. No token." });
  }

  try {
    const validToken = jwt.verify(jwToken, process.env.JWT_KEY);
    req.userID = validToken.userID;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Access denied. Invalid token." });
  }
}

module.exports = authorize;
