"use strict"

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./ticket.sql', (err) => {
    if (err) throw err;
});