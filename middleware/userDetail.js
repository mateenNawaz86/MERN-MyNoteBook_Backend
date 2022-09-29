var jwt = require("jsonwebtoken");

// SecretKey
const JWT_SECRET = "FALLISBMATEEN19BSCS";

const userDetail = (req, res, next) => {
  // Get the user from jwt token and add id it into the req object
  try {
    const userToken = req.header("auth-token");
    if (!userToken) {
      return res.status(401).json({ errors: "Please enter correct token!" });
    }

    // here verify the user using token
    const userData = jwt.verify(userToken, JWT_SECRET);
    req.user = userData.user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Please enter correct token!" });
  }
};

module.exports = userDetail;
