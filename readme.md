## 2-6 Install Dependencies and Basic Express Setup

### create .gitignore
```code
node_modules/
```

### npm setting
```bash
$ git init
$ bash init (endpoint = server.js)
$ npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
$ npm i -D nodemon concurrently
```

### create root/server.js
```javascript
const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API RUNNING..'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

```

### change package.json
```json
"scripts": {
    "start": "node server",
    "server": "nodemon server"
  },
```

### run server
```bash
$ npm run server
```
### check in the Postman
```
get || http://localhost:5000 || send 

result : API RUNNIG..
```

## 2-7 Connecting To MongoDB With Mongoose

### mongoDB
[mongoDB](https://cloud.mongodb.com/v2/5ce73a12014b761dcc9cfb59#clusters)
```
CONNECT
→ Connect Your Application
→ mongodb://the2792:canyou12@devconnector-shard-00-00-jy5dk.mongodb.net:27017,devconnector-shard-00-01-jy5dk.mongodb.net:27017,devconnector-shard-00-02-jy5dk.mongodb.net:27017/test?ssl=true&replicaSet=DevConnector-shard-0&authSource=admin&retryWrites=true<br>
   
   * Versions are different, so you have to test them one by one. 
```
### create folder root/config
```bash
$ midkr config
```

### create root/config/default.json
```json
{
  "mongoURI": "mongodb://the2792:canyou12@devconnector-shard-00-00-jy5dk.mongodb.net:27017,devconnector-shard-00-01-jy5dk.mongodb.net:27017,devconnector-shard-00-02-jy5dk.mongodb.net:27017/test?ssl=true&replicaSet=DevConnector-shard-0&authSource=admin&retryWrites=true"
}

```
### create root/config/db.js
```javascript
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('mongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
```
### change root/server.js
```javascript
const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API RUNNING..'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

## 2-8 Route Files With Express Router

### create folder and files on root 
```bash
$ mkdir -p routes/api
$ cd routes/api
$ touch auth.js profile.js users.js posts.js
$ cd ../../
```

### change root/routes/api/auth.js posts.js profile.js users.js
```javascript
const express = require('express');
const router = express.Router();

// @route    GET api/auth
// @desc     Test route
// @access   Public
// public    : don't need token on localstorage
// private   : must have token on localstorage
router.get('/', (req, res) => res.send('Auth Route'));

module.exports = router;
```

### change root/server.js
```javascript
const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API RUNNING..'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

```

## 3-9 Creating  The User Model

### create root/models
```bash
$ mkdir models
$ cd models
$ touch User.js Auth.js Post.js Profile.js
```

### change root/models/User.js
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  grade: {
    type: String,
    default: 'normal',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
```

## 3-10 Request & Body Validation

### change root/server.js

```javascript
const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API RUNNING..'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

## change root/routes/api/users.js
[express-validator document]('https://express-validator.github.io/docs/')
```javascript
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
    res.send('User Route - Post');
  }
);

module.exports = router;

```

## 3-11 User Registration

### change root/routes/api/users.js
```javascript
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email: email });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists..' }] });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //Return jsonwebtoken
      res.send('User User Registered!');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!!');
    }
  }
);

module.exports = router;


```

### change root/config/db.js
```javascript
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      //if dont write this code it will be deprecatedError !
      useNewUrlParser: true,
      useCreateIndex: true
    });
    console.log('mongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

```

## 3-12 Implementing JWT

### JWT
[JWT HOMEPAGE]('jwt.io')

### 