"use strict";

const db = require('./db');
const crypto = require('crypto');

exports.getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
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
            }
            if (row === undefined) {
                resolve('User not found');
            }
            const user = row;

            crypto.scrypt(password, user.salt, 32, function (err, hashedPassword) {
                if (err) {
                    reject(err);
                }
                if (!crypto.timingSafeEqual(Buffer.from(user.password), Buffer.from(hashedPassword))) {
                    resolve('Wrong password');
                }
                resolve(user);
            });
        });
    });
}