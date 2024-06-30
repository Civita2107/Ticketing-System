"use strict"

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('ticket.db', (err) => {
    if (err) throw err;
});

module.exports = db;