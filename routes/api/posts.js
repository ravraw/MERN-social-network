const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post  model
const Post = require("../../models/Posts");
// User  model
//const User = require("../../models/User");

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

// @route   GET api/posts
// @desc    get posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ data: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPosts: "No posts found !" }));
});

// @route   GET api/posts/:id
// @desc    get a single post by id
// @access  Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPost: "No post found" }));
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

// @route   DELETE api/posts/:id
// @desc   Delete a single post
// @access  Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check for post owner]
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorized: "User is not authorized to delete" });
        }
        //Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "No" }));
  }
);

module.exports = router;
