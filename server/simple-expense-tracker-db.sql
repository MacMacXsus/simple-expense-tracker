CREATE DATABASE IF NOT EXISTS `simple-expense-tracker-db`;
USE `simple-expense-tracker-db`;

-- Early version of the expenses table, with an auto-incrementing primary key and a timestamp for when each expense was created.
-- still in development, may be modified in the future to include additional fields or constraints as needed.
-- this sql file is for your reference to let you know what the database structure looks like, and to help you understand how to interact with it in your application code.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reset_otp VARCHAR(6) DEFAULT NULL,
    reset_otp_expires_at DATETIME DEFAULT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    verification_otp VARCHAR(6) DEFAULT NULL,
    verification_otp_expires_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,

    KEY fk_expenses_users (user_id),
    CONSTRAINT fk_expenses_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);