const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const User = db.User;
const authorize = require("../middleware/authorize");

const createJWT = (userID) => {
  const payload = { userID: userID };
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });
};

router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, address, registeredVoter } =
    req.body;

  if (!username || !password || !firstName) {
    return res.status(400).json("Username, Password, and First Name required.");
  }

  try {
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) return res.status(401).json("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { username, firstName, lastName, address, registeredVoter };
    newUser.password = hashedPassword;

    const user = await User.create(newUser);

    const jwToken = createJWT(user.id);

    return res.status(201).json({ jwToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.message || "Server error during signup.");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Username and Password required.");
  }

  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) return res.status(401).json("Invalid credentials.");

    const pwValid = await bcrypt.compare(password, user.password);
    if (!pwValid) return res.status(401).json("Invalid credentials.");

    const jwToken = createJWT(user.id);

    return res.status(200).json({ jwToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.mesage || "Server error during login.");
  }
});

router.get("/user", authorize, async (req, res) => {
  try {
    const user = await User.findByPk(req.userID);
    const { username, firstName, lastName, address, registeredVoter } = user;
    res.json({ username, firstName, lastName, address, registeredVoter });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message || "Error occured retrieving user data.");
  }
});

// Temp routes for dev testing
router.post("/check-auth", authorize, (req, res) => {
  try {
    res.status(200).send(`Authorized. Your user ID is: ${req.userID}`);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message || "Error in authorization.");
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await User.findAll());
  } catch (err) {
    res.status(500).send(err.message || "Error occurred retrieving Users.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await User.findByPk(req.params.id));
  } catch (err) {
    res.status(500).send(err.message || "Error occured retrieving the User.");
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(await User.update(req.body, { where: { id: req.params.id } }));
  } catch (err) {
    res.status(500).send(err.message || "Error occured updating the User.");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.json(await User.destroy({ where: { id: req.params.id } }));
  } catch (err) {
    res.status(500).send(err.message || "Error occurred deleting the User.");
  }
});

module.exports = router;
