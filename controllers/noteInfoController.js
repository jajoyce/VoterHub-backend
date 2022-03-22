const express = require("express");
const authorize = require("../middleware/authorize");
const router = express.Router();
const db = require("../models");
const NoteInfo = db.NoteInfo;

router.get("/", authorize, async (req, res) => {
  try {
    const notesInfo = await NoteInfo.findAll({
      where: { userID: req.userID },
    });
    return res.status(200).json(notesInfo);
  } catch (err) {
    console.log("GET NOTEINFO ERROR", err);
    return res.status(500).json({
      message: err.message || "An error occured retrieving Notes on Info.",
    });
  }
});

module.exports = router;
