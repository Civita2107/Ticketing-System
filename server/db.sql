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

INSERT INTO users (username, password, salt, admin) VALUES ('mario', '044335cbfd87b121696cb5667415763531f72a783ce6b9142c6c593be7c140b3', '11111111111111111111111111111111', 1);
INSERT INTO users (username, password, salt, admin) VALUES ('luigi', '9068ae40af905ad972cf449a6e4dad94ac2ff0d0f1d36d7735639ee8f6283683', '22222222222222222222222222222222', 0);
INSERT INTO users (username, password, salt, admin) VALUES ('peach', '22ad2ca718f6cdea11145adcef93adf929c5df29df2dfd636007f636c4150340', '33333333333333333333333333333333', 0);
INSERT INTO users (username, password, salt, admin) VALUES ('toad', 'e96d9f20c3648d55a59e68b6d9027cd25947b0e4d4494b20919a94061031fc45', '44444444444444444444444444444444', 1);
INSERT INTO users (username, password, salt, admin) VALUES ('yoshi', 'bf8e8626b2a27371e7479afb45072397fd2d7e67e67dfb4c61accea983ca78e5', '55555555555555555555555555555555', 0);
INSERT INTO users (username, password, salt, admin) VALUES ('bowser', 'aa9564c3b4ba8003bb457eabb83058a71be8c7f131ae0e88750411bc1cdba0f0', '66666666666666666666666666666666', 0);

COMMIT;