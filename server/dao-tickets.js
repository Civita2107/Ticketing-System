"use strict";

const db = require('./db');
const dayjs = require('dayjs');

const convertFromDb = (dbRecord) => {
    const ticket = {};
    ticket.id = dbRecord.id;
    ticket.title = dbRecord.title;
    ticket.state = dbRecord.state;
    ticket.category = dbRecord.category;
    ticket.owner = dbRecord.owner;
    ticket.timestamp = dbRecord.timestamp;
    ticket.content = dbRecord.content;

    return ticket;
}
//get all tickets
exports.listTickets = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tickets';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            const tickets = rows.map((ticket) => {
                const ticket = convertFromDb(ticket);
                return ticket;
            });
            resolve(tickets);
        })
    });
}

exports.createTicket = (ticket) => {
    if (ticket.title === undefined || ticket.title === '') {
        ticket.title = 'Untitled';
    }
    if (ticket.content === undefined || ticket.content === '') {
        ticket.content = 'No content';
    }
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tickets (title, state, category, owner, timestamp, content) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [ticket.title, ticket.state, ticket.category, ticket.owner, dayjs().format('YYYY-MM-DD HH:mm:ss'), ticket.content], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

exports.openTicket = (ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET state = ? WHERE id = ?';
        db.run(sql, [1, ticketId], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

exports.closeTicket = (ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET state = ? WHERE id = ?';
        db.run(sql, [0, ticketId], function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}