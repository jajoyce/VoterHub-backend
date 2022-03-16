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
    console.log("GET NOTEREP ERROR", err);
    return res.status(500).json({
      message: err.message || "An error occured retrieving Notes on Reps.",
    });
  }
});

router.post("/", authorize, async (req, res) => {
  if (!req.body.content || !req.body.repName || !req.body.repOffice) {
    return res.status(400).json({
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
      console.log("POST NOTEREP ERROR", err);
      return res.status(500).json({
        message: err.message || "An error occurred creating new Note on Rep.",
      });
    }
  }
});

router.put("/", authorize, async (req, res) => {
  if (!req.body.id || !req.body.content) {
    return res.status(400).json("Note ID and content required.");
  }
  try {
    const putContent = { content: req.body.content };

    const updated = await NoteRep.update(putContent, {
      where: { id: req.body.id, userID: req.userID },
    });

    if (updated[0]) {
      console.log("UPDATED NOTE", updated[0]);
      return res.status(200).json(updated[0]);
    }
  } catch (err) {
    console.log("UPDATE NOTE ERROR", err);
    res.status(500).json(err.message || "Error occured updating the User.");
  }
});

router.delete("/", authorize, async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json("Note ID required.");
  }
  try {
    const deleted = await NoteRep.destroy({
      where: { id: req.body.id, userID: req.userID },
    });
    if (deleted) {
      console.log("DELETED NOTE", deleted);
      return res.status(200).json(deleted);
    }
  } catch (err) {
    console.log("DELETE NOTE ERROR", err);
    res.status(500).send(err.message || "Error occurred deleting the User.");
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
