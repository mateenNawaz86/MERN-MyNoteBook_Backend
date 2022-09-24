const mongoose = require("mongoose");

// MongoDB URI string
const mongoURI = "mongodb://localhost:27017/";

// function for connect to MongoDB
const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to MongoDB Successfully");
  });
};

module.exports = connectToMongo;
