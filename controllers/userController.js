const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;

router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, address, registeredVoter } =
    req.body;

  if (!username || !password || !firstName)
    return res.status(400).json("Username, Password, and First Name required.");

  try {
    const existingUser = await User.findOne({ where: { username: username } });
    if (existingUser) return res.status(401).json("User already exists.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { username, firstName, lastName, address, registeredVoter };
    newUser.password = hashedPassword;

    const user = await User.create(newUser);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message || "An error occurred creating new User.");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json("Username and Password required.");

  try {
    const user = await User.findOne({ where: { username: username } });

    if (!user) return res.status(401).json("Invalid credentials.");

    const pwValid = await bcrypt.compare(password, user.password);

    if (!pwValid) return res.status(401).json("Invalid credentials.");

    return res.json(user)
  } catch (err) {}
});

// Temp route for testing. Remember to remove.
router.get("/", async (req, res) => {
  try {
    res.json(await User.findAll());
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "An error occured retrieving Users." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await User.findByPk(req.params.id));
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occured retrieving the User.",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(await User.update(req.body, { where: { id: req.params.id } }));
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "An error occured updating the User." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.json(await User.destroy({ where: { id: req.params.id } }));
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "An error occurred deleting the User." });
  }
});

module.exports = router;
