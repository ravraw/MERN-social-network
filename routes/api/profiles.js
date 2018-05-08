const express = require("express");
const router = express.Router();

// @route   GET api/profiles/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Handling /profiles route"
  });
});
module.exports = router;
