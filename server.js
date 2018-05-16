const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
//const gravatar = require("gravatar");
//const bcrypt = require("bcryptjs");
const passport = require("passport");

// Routes  endpoints
const users = require("./routes/api/users");
const profiles = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// bodyparser middlewares
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// db config
const db = require("./config/key").mongoURI;

// db variables

require("dotenv").config();

// cONNECT TO MONGODB
mongoose
  .connect(db)
  .then(() => {
    console.log(" Mongodb connected...");
  })
  .catch(err => {
    console.log(err);
  });

//Passport middleware
app.use(passport.initialize());

//passport Config
require("./config/passport")(passport);

// USE ROUTS TO HANDLE REQUESTS
app.use("/api/users", users);
app.use("/api/profile", profiles);
app.use("/api/posts", posts);

// const port = process.env.PORT || 5000;
// //Server listening....
// app.listen(port, () => {
//   console.log(`Server running on port ${port} ...`);
// });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
