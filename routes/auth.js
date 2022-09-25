const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// create a user using: 'POST' --> /api/auth/createuser. Doesn't require authentication
router.post(
  "/createuser",
  [
    body("name", "Please enter a valid name").isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be atleast 6 characters").isLength({
      min: 6,
    }),
  ],

  async (req, res) => {
    // if there are error, send bad request with an error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // create new_user code with out async
    // User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // })
    //   .then((user) => res.json(user))
    //   .catch((error) => {
    //     request.json(error);
    //   });

    try {
      // check whether the user exist with the same email address
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User already exist with the same email address!" });
      }

      // create new_user with unique email address
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      res.json(user);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
