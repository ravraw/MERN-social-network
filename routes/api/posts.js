const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post  model
const Post = require("../../models/Posts");

// Validation

const validatePostFields = require("../../validation/posts");

// @route   GET api/posts/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Handling /posts route"
  });
});

// @route   POST api/posts
// @desc    Create posts
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    // Check validation and return erros
    const { errors, isValid } = validatePostFields(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
