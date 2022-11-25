CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- add users username unique
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);

-- message table
CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  message_from INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_to INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- insert some example message
INSERT INTO message (content, message_from, message_to) VALUES('hi tuna', 10, 9);
-- select message between two users;
SELECT * FROM message WHERE (message_from=9 AND message_to=11) OR (message_from=11 AND message_to=9) ORDER BY created_at DESC;

-- select users who send message between each others;
-- SELECT * FROM users u INNER JOIN message m ON u.id = m.message_from OR u.id=m.message_to WHERE (m.message_from=9 AND m.message_to=11) OR (message_from=11 AND message_to=9) AND u.id != 9 ORDER BY m.created_at;

-- select users send/reveive message between

SELECT distinct u.* FROM users u INNER JOIN message m ON u.id = m.message_to OR u.id = m.message_from WHERE( m.message_from = 9 OR m.message_to = 9) AND u.id != 9;