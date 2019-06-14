const express = require('express');
const router = express.Router();

// @route    GET api/posts
// @desc     Test route
// @access   Public
// public    : don't need token on localstorage
// private   : must have token on localstorage
router.get('/', (req, res) => res.send('Posts Route'));

module.exports = router;
