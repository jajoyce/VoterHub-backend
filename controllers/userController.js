const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;


router.post("/register", async (req, res) => {
  const { username, password, firstName, lastName, address, registeredVoter } =
    req.body;

  if (!username || !password || !firstName) {
    return res
      .status(400)
      .send({ message: "Username, Password, and First Name are required." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = { username, firstName, lastName, address, registeredVoter };
  newUser.password = hashedPassword;

  try {
    const user = await User.create(newUser);
    console.log(user);
    res.json(user);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred creating new User.",
    });
  }
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
