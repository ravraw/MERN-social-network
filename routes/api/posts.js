const express = require("express");
const router = express.Router();

// @route   GET api/posts/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Handling /posts route"
  });
});
module.exports = router;
