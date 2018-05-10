const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const keys = require("../../config/key");
const passport = require("passport");

// load INPUT VALIDATOR

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load user model

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
  const { errors, isValid } = validateRegisterInput(req.body);

  // check  Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(404).json(errors);
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

// @route   GET api/users/delete
// @desc    delete a registered user
// @access  Public

router.delete("/:userId", (req, res) => {
  const id = req.params.userId;
  User.remove({
    _id: id
  })
    .exec()
    .then(result => {
      res.status(200).json({ result });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});

// @route   GET api/users/login
// @desc    login user / returning JWT token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const { errors, isValid } = validateLoginInput(req.body);

  // check  Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // find user by email
  User.findOne({ email: email })
    .then(user => {
      // check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
      }
      // check password if user is valid
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //user matched

          // Create jwt payload
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };

          // sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer  " + token
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(404).json(errors);
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});

// @route   GET api/users/current
// @desc    Returns current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
