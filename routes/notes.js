const express = require("express");
const fetchuser = require("../middleware/getuser");
const user = require("../models/user");
const { body, validationResult } = require("express-validator");
const Note = require("../models/notes");

const router = express.Router();

// Route 1 : Add a Note , Login required
router.post(
  "/addNote",fetchuser,
  body("title", "Add a valid title").isLength({ min: 3 }),
  body("description", "Add a valid description").isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
      }
      let { title, description, tag } = req.body;
      // Checking if same note exists
      let isNote = await Note.findOne({title : title});
      if(isNote){
        return res.status(400).send("A Note with this title already exits");
      }
      let currUser = await user.findOne({email : req.user.email});
      let newNote = await Note.create({
        user : currUser.id,
        title,description,tag
      });
      res.json(newNote);
    } catch (error) {
      res.status(500).json("Internal sever error");
    }
  }
);

//Route 2 : Fetch a Note : login required
router.get('/fetchNote',fetchuser,async (req,res)=>{
  const currUser = await user.findOne({email : req.user.email});
  let notes = await Note.find({user : currUser.id });
  res.json(notes);
})
module.exports = router;
