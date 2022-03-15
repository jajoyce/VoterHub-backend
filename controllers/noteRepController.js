const express = require("express");
const authorize = require("../middleware/authorize");
const router = express.Router();
const db = require("../models");
const NoteRep = db.NoteRep;

router.get("/", authorize, async (req, res) => {
  try {
    const notesRep = await NoteRep.findAll({
      where: { userID: req.userID },
    });
    return res.json(notesRep);
  } catch (err) {
    return res.status(500).send({
      message: err.message || "An error occured retrieving Notes on Reps.",
    });
  }
});

router.post("/", authorize, async (req, res) => {
  if (!req.body.content || !req.body.repName || !req.body.repOffice) {
    return res.status(400).send({
      message: "Note Content, Rep's name, and Rep's office are required.",
    });
  } else {
    const newNoteRep = {
      content: req.body.content,
      repName: req.body.repName,
      repOffice: req.body.repOffice,
      userID: req.userID,
    };
    try {
      const noteRep = await NoteRep.create(newNoteRep);
      return res.json(noteRep);
    } catch (err) {
      return res.status(500).send({
        message: err.message || "An error occurred creating new Note on Rep.",
      });
    }
  }
});

// ------
// ------
// ------
// router.get("/", async (req, res) => {
//   try {
//     res.json(await NoteRep.findAll());
//   } catch (err) {
//     res.status(500).send({
//       message: err.message || "An error occured retrieving Notes on Reps.",
//     });
//   }
// });

// router.post("/", async (req, res) => {
//   if (!req.body.content || !req.body.repName || !req.body.repOffice) {
//     res.status(400).send({
//       message: "Note Content, Rep's name, and Rep's office are required.",
//     });
//     return;
//   } else {
//     const newNoteRep = {
//       content: req.body.content,
//       repName: req.body.repName,
//       repOffice: req.body.repOffice,
//     };
//     try {
//       const noteRep = await NoteRep.create(newNoteRep);
//       res.json(noteRep);
//     } catch (err) {
//       res.status(500).send({
//         message: err.message || "An error occurred creating new Note on Rep.",
//       });
//     }
//   }
// });

module.exports = router;
