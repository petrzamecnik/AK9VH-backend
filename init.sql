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
