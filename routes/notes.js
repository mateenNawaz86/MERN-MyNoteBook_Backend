const express = require("express");
const notesRouter = express.Router();

notesRouter.get("/", (req, res) => {
  res.json({
    notes: "Notes is here",
  });
});

module.exports = notesRouter;
