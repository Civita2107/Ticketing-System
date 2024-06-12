'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const cors = require('cors');

const ticketDao = require('./dao-tickets');
const userDao = require('./dao-users');

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
const port = 3001;

const maxTitleLength = 40;
const maxContentLength = 400;

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[$(param)]: ${msg}`;
};

const corsOption = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOption));

const passport = require('passport');
const LocalStrategy = require('passport-local');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'User not authenticated' });
};

app.get('/tickets', (req, res) => {
  ticketDao.listTickets().then((tickets) => {
    res.json(tickets);
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving tickets' });
  });
});

app.get('/tickets/:id', isLoggedIn, 
  [check('id').isInt({ min: 1 })],
  async (req, res) => {
  try {
    const ticket = await ticketDao.getTicketById(req.params.id);
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving ticket' });
  }
});

app.post('/tickets', [
  check('title').isLength({ min: 1, max: maxTitleLength }),
  check('content').isLength({ min: 1, max: maxContentLength }),
], async (req, res) => {
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const ticket = {
    title: req.body.title,
    state: 1,
    category: req.body.category,
    owner: req.user.id,
    content: req.body.content,
  };

  try {
    const result = await ticketDao.createTicket(ticket);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating ticket' });
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
