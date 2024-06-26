"use strict";

const db = require('./db');
const crypto = require('crypto');

exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, admin FROM users WHERE id = ?';
        db.get(sql, [userId], (err, row) => {
            if (err) {
                reject(err);
            }
            resolve(row);
        });
    });
}

exports.loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                reject('Incorrect username or password');
                return;
            }
            const user = { id: row.id, username: row.username, admin: row.admin };

            crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                if (err) {
                    reject(err);
                }
                if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
                    reject('Incorrect username or password');
                }
                resolve(user);
            });
        });
    });
}

// exports.getUserById(2).then((user) => {
//     console.log(user);
// }).catch((err) => {
//     console.log(err);
// });

// exports.loginUser('toad', 'password').then((user) => {
//     console.log(user);
// }).catch((err) => {
//     console.log(err);
// });