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

router.post("/", authorize, async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({
      message: "Note Content is required.",
    });
  } else {
    const newNoteInfo = {
      content: req.body.content,
      userID: req.userID,
    };
    try {
      const noteInfo = await NoteInfo.create(newNoteInfo);
      return res.status(201).json(noteInfo);
    } catch (err) {
      console.log("POST NOTEINFO ERROR", err);
      return res.status(500).json({
        message: err.message || "An error occurred creating new Note on Info.",
      });
    }
  }
});

module.exports = router;
