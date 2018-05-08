const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

// db config
const db = require("./config/key").mongoURI;

// cONNECT TO MONGODB
mongoose
  .connect(db)
  .then(() => {
    console.log(" Mongodb connected...");
  })
  .catch(err => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Server listening....
app.listen(port, () => {
  console.log(`Server running on port ${port} ...`);
});
