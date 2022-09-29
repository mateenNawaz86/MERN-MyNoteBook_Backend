const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const userDetail = require("../middleware/userDetail");
const { body, validationResult } = require("express-validator");

// Route 1: fetching all the notes of user using : 'GET' /api/notes/fetchallnotes, Login required
router.get("/fetchallnotes", userDetail, async (req, res) => {
  try {
    // fetching all notes of specific user
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.error(error);
    console.log("Internal server error");
  }
});

// Route 2: create note for user using : 'POST' /api/notes/addnote, Login required
router.post(
  "/addnote",
  userDetail,
  [
    body("title", "Please enter title must be atleast 5 characters").isLength({
      min: 5,
    }),
    body(
      "description",
      "Please enter description must be atleast 8 characters"
    ).isLength({ min: 8 }),
  ],

  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // if there are error, send bad request with an error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // create new  note
      const newNote = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });

      // save note
      const savedNote = await newNote.save();
      res.json(savedNote);  
      
    } catch (error) {
      console.error(error);
      console.log("Internal server error");
    }
  }
);
module.exports = router;
