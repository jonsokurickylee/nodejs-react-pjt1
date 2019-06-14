const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// @route    GET api/users
// @desc     Test route
// @access   Public
// public    : don't need token on localstorage
// private   : must have token on localstorage
router.get('/', (req, res) => {
  console.log(req.body);
  res.send('User Route - Get');
});

module.exports = router;

/*
=====================================================
*/

// @route    POST api/users
// @desc     Test route
// @access   Public
// public    : don't need token on localstorage
// private   : must have token on localstorage
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req;

    //See if user exists

    //Get users gravatar

    //Encrypt password

    //Return jsonwebtoken

    res.send('User Route - Post');
  }
);

module.exports = router;
