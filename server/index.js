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
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOption));

const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(async function verify(username, password, callback) {
  try {
    const user = await userDao.loginUser(username, password);
    if (!user) {
      return callback(null, false, { message: 'Incorrect username or password' });
    }
    return callback(null, user);
  } catch (err) {
    return callback(null, false, { message: err });
  }
}));

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser(async (user, callback) => {
  return callback(null, user);
});

app.use(session({
  secret: 'Calm down, you can reuse it for the exam!',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false },
}));

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'User not authenticated' });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    return next();
  }
  return res.status(403).json({ error: 'User not authorized' });
}

app.get('/users/:id',
  [check('id').isInt({ min: 1 })],
  async (req, res) => {
    try {
      const user = await userDao.getUserById(req.params.id);
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error retrieving user' });
    }
  });

app.get('/tickets', (req, res) => {
  ticketDao.listTickets().then((tickets) => {
    if (req.user && req.user.admin) {
      return res.json(tickets);
    } else {
      const filteredTickets = tickets.map(ticket => {
        return {
          id: ticket.id,
          title: ticket.title,
          state: ticket.state,
          category: ticket.category,
          owner: ticket.owner,
          timestamp: ticket.timestamp
        }
      });
      return res.json(filteredTickets);
    }
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

app.post('/tickets', isLoggedIn,
  [check('title').isLength({ min: 1, max: maxTitleLength }),
  check('content').isLength({ min: 1, max: maxContentLength })],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors);
    }

    const ticket = {
      title: req.body.title,
      state: 1,
      category: req.body.category,
      owner: req.user.id,
      content: req.body.content
    };

    try {
      const result = await ticketDao.createTicket(ticket);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error creating ticket' });
    }
  });

app.post('/tickets/:id', isLoggedIn,
  [check('content').isLength({ min: 1, max: maxContentLength })],
  async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors);
    }

    const block = {
      ticket_id: req.params.id,
      author: req.user.id,
      content: req.body.content
    }
    try {
      const result = await ticketDao.addBlock(block);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error adding block' });
    }
  });

app.put('/tickets/:id', isLoggedIn,
  [check('id').isInt({ min: 1 })],
  async (req, res) => {
    try {
      ticket = await ticketDao.getTicketById(req.params.id);
      if (ticket.owner !== req.user.id || !req.user.admin) {
        return res.status(403).json({ error: 'User not authorized' });
      } else if (ticket.state === 0 && (ticket.owner === req.user.id || req.user.admin)) {
        await ticketDao.openTicket(req.params.id);
        res.json({ message: 'Ticket opened' });
      } else if (ticket.state === 1 && (ticket.owner === req.user.id || req.user.admin)) {
        await ticketDao.closeTicket(req.params.id);
        res.json({ message: 'Ticket closed' });
      } else if (ticket.category !== req.body.category && req.user.admin) {
        await ticketDao.updateCategory(req.params.id, req.body.category);
        res.json({ message: 'Category updated' });
      }
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error opening ticket' });
    }
  });

app.post('/sessions', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: info });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.json(req.user);
    });
  })(req, res, next);
});

app.get('/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

app.delete('/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: 'Logout successful' });
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
