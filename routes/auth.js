const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

// this is for scure psw
const bcrypt = require("bcryptjs");

// this is for user authentication
var jwt = require("jsonwebtoken");

// Middleware for getting user data
const userDetail = require("../middleware/userDetail");

// SecretKey
const JWT_SECRET = "FALLISBMATEEN19BSCS";

// Route 1: create a user using: 'POST' --> /api/auth/createuser. Doesn't require authentication
router.post(
  "/createuser",

  // checks for creating user
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

    try {
      // check whether the user exist with the same email address
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User already exist with the same email address!" });
      }

      // Generate a hash+salt  scure password
      const salt = await bcrypt.genSalt(10);
      const securePsw = await bcrypt.hash(req.body.password, salt);

      // create new_user with unique email address
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePsw,
      });

      const userData = {
        user: {
          id: user.id,
        },
      };

      // assign token to user
      const authicationToken = jwt.sign(userData, JWT_SECRET);
      res.json({ authicationToken });
      //res.json(user);
    } catch (error) {
      console.error(error);
      console.log("Internal server error");
    }
  }
);

// Route 2: Authenticate a user using: 'POST' --> /api/auth/login. NOT login required
router.post(
  "/login",
  [
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

    // getting email & psw from req.body using object Destructuring
    const { email, password } = req.body;

    try {
      // check whether the user exist with the same email address
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials!" });
      }

      // compare password with existing user psw hashes
      const pswCompare = await bcrypt.compare(password, user.password);
      if (!pswCompare) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials!" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      // assign token to user
      const authicationToken = jwt.sign(payload, JWT_SECRET);
      res.json({ authicationToken });
    } catch (error) {
      console.error(error);
      console.log("Internal server error");
    }
  }
);

// Route 3: Get loggedin user details using : 'POST' /api/auth/getuser --> login required
router.post("/getuser", userDetail, async (req, res) => {
  try {
    // getting user id from req.body
    const userId = req.user.id;
    const userDetail = await User.findById(userId).select("-password");
    res.send(userDetail);
  } catch (error) {
    console.error(error);
    console.log("Internal server error");
  }
});

module.exports = router;
