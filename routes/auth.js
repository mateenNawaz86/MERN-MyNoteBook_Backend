const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    name: "Mateen Nawaz",
    age: 21,
  });
});

module.exports = router;
