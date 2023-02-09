const express = require("express");
const fetchuser = require("../middleware/getuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/notes");
const router = express.Router();

// Route 1 : Add a Note , Login required
router.post(
  "/addNote",
  body("title", "Add a valid title").isLength({ min: 3 }),
  body("description", "Add a valid description").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors });
      }
      let { title, description, tag } = req.body;
      let newNote = new Note({
        title,
        description,
        tag,
      });
      let savedNote = await newNote.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
