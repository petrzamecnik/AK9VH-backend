CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50) UNIQUE NOT NULL,
    email      VARCHAR(100)       NOT NULL,
    password   VARCHAR(255)       NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
                                                  id SERIAL PRIMARY KEY,
                                                  token TEXT NOT NULL,
                                                  expiry TIMESTAMP WITH TIME ZONE NOT NULL,
                                                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                                  CONSTRAINT unique_token UNIQUE(token)
);

CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_token ON blacklisted_tokens(token);
CREATE INDEX IF NOT EXISTS idx_blacklisted_tokens_expiry ON blacklisted_tokens(expiry);



CREATE TABLE IF NOT EXISTS games
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url   TEXT,
    price       VARCHAR(50),
    download_url TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users (id),
    game_id    INTEGER REFERENCES games (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO games (title, description, image_url, price, download_url)
VALUES ('Epic Adventure', 'Embark on an epic journey through mystical lands.',
        'https://dummyimage.com/400x300', 'Free', 'https://ak9vh-games.s3.eu-north-1.amazonaws.com/Game1.exe'),
       ('Space Explorers', 'Explore the galaxy and uncover its secrets.',
        'https://dummyimage.com/400x300', 'Free', 'https://ak9vh-games.s3.eu-north-1.amazonaws.com/Game1.exe'),
       ('Mystery Island', 'Solve the mysteries of a remote island.',
        'https://dummyimage.com/400x300', 'Free', 'https://ak9vh-games.s3.eu-north-1.amazonaws.com/Game1.exe');