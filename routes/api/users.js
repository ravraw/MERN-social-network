const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/Users");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Handling /users route"
  });
});

// @route   GET api/users/
// @desc    List all registered users
// @access  Public

router.get("/", (req, res) => {
  User.find()
    .exec()
    .then(users => {
      if (users.length >= 1) {
        res.status(200).json(users);
        // console.log(users);
      } else {
        res.status(404).json({
          message: "not entries found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});

// @route   GET api/users/register
// @desc    Register a user
// @access  Public

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(404).json({
        email: "Email already exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" //default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(200).json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
