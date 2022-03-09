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
  if ((!req.body.firstName)) {
    res.status(400).send({ message: "First name required." });
    return;
  } else {
    const newUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    try {
      const user = await User.create(newUser);
      res.json(user);
    } catch (err) {
      res
        .status(500)
        .send({ message: err.message || "An error occurred creating new User." });
    }
  }
});

module.exports = router;
