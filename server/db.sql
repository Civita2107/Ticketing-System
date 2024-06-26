BEGIN TRANSACTION;

CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state INTEGER NOT NULL DEFAULT 1,
    category TEXT NOT NULL,
    owner INTEGER NOT NULL,
    title TEXT NOT NULL,
    timestamp TEXT NOT NULL,
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

INSERT INTO users (username, password, salt, admin) VALUES ('mario', '044335cbfd87b121696cb5667415763531f72a783ce6b9142c6c593be7c140b3', '11111111111111111111111111111111', 1);
INSERT INTO users (username, password, salt, admin) VALUES ('luigi', '9068ae40af905ad972cf449a6e4dad94ac2ff0d0f1d36d7735639ee8f6283683', '22222222222222222222222222222222', 0);
INSERT INTO users (username, password, salt, admin) VALUES ('peach', '22ad2ca718f6cdea11145adcef93adf929c5df29df2dfd636007f636c4150340', '33333333333333333333333333333333', 0);
INSERT INTO users (username, password, salt, admin) VALUES ('toad', 'e96d9f20c3648d55a59e68b6d9027cd25947b0e4d4494b20919a94061031fc45', '44444444444444444444444444444444', 1);
INSERT INTO users (username, password, salt, admin) VALUES ('yoshi', 'bf8e8626b2a27371e7479afb45072397fd2d7e67e67dfb4c61accea983ca78e5', '55555555555555555555555555555555', 0);
INSERT INTO users (username, password, salt, admin) VALUES ('bowser', 'aa9564c3b4ba8003bb457eabb83058a71be8c7f131ae0e88750411bc1cdba0f0', '66666666666666666666666666666666', 0);

INSERT INTO tickets (state, category, owner, title, timestamp, content) VALUES (1, 'inquiry', 2, 'How to use the software?', '2024-06-13 00:03:15', 'I am new to the software and I am not sure how to use it. Can you help me?');
INSERT INTO tickets (state, category, owner, title, timestamp, content) VALUES (1, 'maintainance', 3, 'Software crashes on startup', '2024-06-13 00:03:20', 'The software crashes every time I try to start it. Can you help me?');
INSERT INTO tickets (state, category, owner, title, timestamp, content) VALUES (0, 'new feature', 2, 'Feature request: Dark mode', '2024-06-13 00:05:24', 'I would like to request a dark mode for the software. Can you add this feature?');
INSERT INTO tickets (state, category, owner, title, timestamp, content) VALUES (0, 'administrative', 3, 'Change email address', '2024-06-13 00:06:30', 'I need to change my email address in the system. Can you help me?');
INSERT INTO tickets (state, category, owner, title, timestamp, content) VALUES (1, 'payment', 1, 'Payment not processed', '2024-06-13 00:07:56', 'I made a payment but it has not been processed yet. Can you check on this?');
INSERT INTO tickets (state, category, owner, title, timestamp, content) VALUES (0, 'inquiry', 1, 'How to update the software?', '2024-06-13 00:08:45', 'I need to update the software to the latest version. Can you guide me through the process?');

INSERT INTO blocks (ticket_id, author, timestamp, content) VALUES (1, 1, '2024-06-21 00:12:32', 'Sure! Here are the steps to use the software: 1. Open the software. 2. Click on the "Help" menu. 3. Select "User Guide" from the menu. 4. Read the user guide for instructions on how to use the software.');
INSERT INTO blocks (ticket_id, author, timestamp, content) VALUES (2, 1, '2024-06-25 23:12:55', 'I will look into the issue and get back to you with a solution.');
INSERT INTO blocks (ticket_id, author, timestamp, content) VALUES (3, 1, '2024-06-26 10:45:30', 'Thank you for the suggestion! I will add dark mode to the feature request list.');
INSERT INTO blocks (ticket_id, author, timestamp, content) VALUES (1, 1, '2024-06-27 08:30:15', 'I have updated your email address in the system.');

COMMIT;