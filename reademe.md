## create .gitignore
```code
node_modules/
```

## npm setting
```bash
$ git init
$ bash init (endpoint = server.js)
$ npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
$ npm i -D nodemon concurrently
```

## create server.js
```javascript
const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API RUNNING..'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

```

## change package.json
```json
"scripts": {
    "start": "node server",
    "server": "nodemon server"
  },
```

## npm run server
```
check in the postman 
get || http://localhost:5000 || send 

result : API RUNNIG..
```

