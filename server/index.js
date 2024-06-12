'use strict';

const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');

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


app.get('/tickets', (req, res) => {
  ticketDao.listTickets().then((tickets) => {
    res.json(tickets);
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving tickets' });
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
