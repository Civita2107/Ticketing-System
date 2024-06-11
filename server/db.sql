BEGIN TRANSACTION;

CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state INTEGER NOT NULL DEFAULT 1,
    category TEXT NOT NULL,
    owner INTEGER NOT NULL,
    title TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(owner) REFERENCES users(id)
    CHECK (category IN ('inquiry', 'maintainance', 'new feature', 'administrative', 'payment')),
    CHECK (state IN (0, 1))
);

CREATE TABLE blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    author INTEGER NOT NULL,
    timestamp INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(ticket_id) REFERENCES tickets(id),
    FOREIGN KEY(author) REFERENCES users(id)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL,
    admin INTEGER NOT NULL DEFAULT 0,
    CHECK (admin IN (0, 1))
);

COMMIT;