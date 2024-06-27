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
    ticket.username = dbRecord.ticket_author_username;

    return ticket;
}
//get all tickets
exports.listTickets = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT tickets.*, ticket_author.username AS ticket_author_username FROM tickets 
            LEFT JOIN users AS ticket_author ON tickets.owner = ticket_author.id 
            ORDER BY tickets.timestamp DESC`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            if (rows) {
            const tickets = rows.map((ticket) => convertFromDb(ticket));
            resolve(tickets);
            } else {
                reject('No tickets found');
                return;
            }
        })
    });
}

exports.getTicketById = (ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tickets WHERE id = ?';
        db.get(sql, [ticketId], (err, row) => {
            if (err) {
                reject(err);
            }
            if (row === undefined) {
                reject('Ticket not found');
                return;
            }
            resolve(convertFromDb(row));
        });
    });
}

exports.createTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        if (ticket.title === undefined || ticket.title === '') {
            reject('Title is required');
        }
        if (ticket.content === undefined || ticket.content === '') {
            reject('Content is required');
        }
        const sql = 'INSERT INTO tickets (title, state, category, owner, timestamp, content) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [ticket.title, ticket.state, ticket.category, ticket.owner, dayjs().format('YYYY-MM-DD HH:mm:ss'), ticket.content], function (err) {
            if (err) {
                reject(err);
            }
            resolve(exports.getTicketById(this.lastID));
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
            resolve(this.lastID);
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
            resolve(this.lastID);
        });
    });
}

exports.updateCategory = (ticketId, category) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET category = ? WHERE id = ?';
        db.run(sql, [category, ticketId], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

exports.updateTicket = (ticket) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tickets SET title = ?, content = ?, category = ? WHERE id = ?';
        db.run(sql, [ticket.title, ticket.content, ticket.category, ticket.id], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

exports.addBlock = (block) => {
    return new Promise((resolve, reject) => {
        if (block.content === undefined || block.content === '') {
            reject('Content is required');
        }
        const sql = 'INSERT into blocks (ticket_id, author, timestamp, content) VALUES (?, ?, ?, ?)';
        db.run(sql, [block.ticket_id, block.author, dayjs().format('YYYY-MM-DD HH:mm:ss'), block.content], function (err) {
            if (err) {
                reject(err);
            }
            resolve(this.lastID);
        });
    });
}

exports.getBlocksByTicketId = (ticketId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT blocks.*, block_author.username AS block_author_username FROM blocks
            LEFT JOIN users AS block_author ON blocks.author = block_author.id 
            WHERE blocks.ticket_id = ? ORDER BY blocks.timestamp ASC`;
        db.all(sql, [ticketId], (err, rows) => {
            if (err) {
                reject(err);
            }

            resolve(rows);
        });
    });
}


// const block = {id: 1, ticket_id: 1, author: 'toad', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), content: 'This is a block'}

// exports.addBlock(block).then((blockId) => {
//     console.log(blockId);
// }).catch((err) => {
//     console.log(err);
// });

// const ticket = { id: 1, title: 'r', state: 0, category: 'inqiry', owner: 'toad', timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'), content: 'rrr' }

// exports.createTicket(ticket).then((ticketId) => {
//     console.log(ticketId);
// }).catch((err) => {
//     console.log(err);
// });

// exports.listTickets().then((tickets) => {
//     console.log(tickets);
// }).catch((err) => {
//     console.log(err);
// });

// exports.getTicketById(5).then((ticket) => {
//     console.log(ticket);
// }).catch((err) => {
//     console.log(err);
// });