const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;

router.get("/", async (req, res) => {
  try {
    res.json(await User.findAll());
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "An error occured retrieving Users." });
  }
});

router.post("/", async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.firstName) {
    res
      .status(400)
      .send({ message: "Username, Password, and First Name are required." });
    return;
  } else {
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      registeredVoter: req.body.registeredVoter,
    };
    try {
      const user = await User.create(newUser);
      res.json(user);
    } catch (err) {
      res.status(500).send({
        message: err.message || "An error occurred creating new User.",
      });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await User.findByPk(req.params.id));
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || "An error occured retrieving User." });
  }
});

module.exports = router;
