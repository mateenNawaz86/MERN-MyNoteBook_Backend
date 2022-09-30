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

// ROUTE 3: Update the existing notes using : 'PUT', '/api/notes/updatenote login required
router.put("/updatenote/:id", userDetail, async (req, res) => {
  // fetching all details from req.body
  const { title, description, tag } = req.body;

  // create new empty object for updating note
  const updateNoteObj = {};

  // assign updateNoteObj values to existing selected detail
  if (title) {
    updateNoteObj.title = title;
  }
  if (description) {
    updateNoteObj.description = description;
  }
  if (tag) {
    updateNoteObj.tag = tag;
  }

  // Find the note to be updated and update it
  let updatedNote = await Notes.findById(req.params.id);

  // Return error message if requested note NOT exist
  if (!updatedNote) {
    return res.status(404).send("NOTE NOT FOUND!");
  }

  // check whether the login user update there note
  if (updatedNote.user.toString() !== req.user.id) {
    return res.status(401).send("Please update your note!");
  }

  // update the existing selected note
  updatedNote = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: updateNoteObj },
    { new: true }
  );

  // send response there
  res.send(updatedNote);
});

// ROUTE 4: Delete the existing notes using : 'DELETE', '/api/notes/deletenote login required
router.delete("/deletenote/:id", userDetail, async (req, res) => {
  // Find the note to be deleted and delete it
  let deleteNote = await Notes.findById(req.params.id);

  // return the error if requested note NOT exist
  if (!deleteNote) {
    res.status(404).send("NOTE NOT FOUND!");
  }

  // check whether the login user delete there note
  if (deleteNote.user.toString() !== req.user.id) {
    return res.status(401).send("Please delete your note!");
  }

  deleteNote = await Notes.findByIdAndDelete(req.params.id);
  res.send({ note: "Delete your note successfully" });
});
module.exports = router;
