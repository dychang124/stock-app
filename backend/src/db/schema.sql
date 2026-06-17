CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    balance NUMERIC(19, 4) DEFAULT 10000
);

CREATE TABLE stocks (
    stock_name VARCHAR(10) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    price NUMERIC(19, 4) NOT NULL,
    prev_close NUMERIC(19, 4) NOT NULL,
    true_value NUMERIC(19, 4) NOT NULL,
    sentiment VARCHAR(50)
);

CREATE TABLE user_stocks (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    stock_name VARCHAR(10) REFERENCES stocks(stock_name) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, stock_name)
);
