'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { body, validationResult } = require('express-validator');

const { expressjwt: jwt } = require('express-jwt');
const jwtSecret = 'vN9yJqR2Hg8zB5kLxP3wS7bA8dX6tCvDwJqF9rYlMkUzCnE2NsQwT7gZf6XpYjV3';

const app = new express();
const port = 3002;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.use(jwt({ // verify the token
  secret: jwtSecret,
  algorithms: ['HS256']
}));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ errors: [{ 'param': 'Server', 'msg': 'Authorization error', 'path': err.code }] });
  } else {
    next();
  }
});

app.post('/stats', [
  body('title').isString(),
  body('category').isString()],
  (req, res) => {
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      err.array().forEach(e => {
        errList.push(...err.errors.map(e => e.msg));
      });
      return res.status(400).json({ errors: errList });
    }

    const admin = req.auth.admin;
    const { title, category } = req.body;

    const numChar = title.replace(/\s+/g, '').length + category.replace(/\s+/g, '').length;
    const randomNum = Math.floor(Math.random() * 240) + 1;
    const result = (10 * numChar) + randomNum; // hours

    if (admin) {
      res.json({ result: result });
    } else {
      res.json({ result: Math.round(result / 24) });
    }
  
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});