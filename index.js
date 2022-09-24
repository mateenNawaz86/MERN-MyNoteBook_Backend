// import connection funtion from database file
const connectToMongo = require("./dataBase");
const express = require("express");

connectToMongo();

const app = express();
const port = 3000;

// app.use("/", (req, res) => {
//   res.send("Hello Mateen Nawaz!");
// });

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
