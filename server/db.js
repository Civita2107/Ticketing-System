"use strict"

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('tickets.db', (err) => {
    if (err) throw err;
});

module.exports = db;