import pool from '../db/index';

export async function getUserStocks(user_id: number) {
    const result = await pool.query('SELECT user_stocks.stock_name, quantity, price FROM user_stocks JOIN stocks ON user_stocks.stock_name = stocks.stock_name WHERE user_id = $1;', [user_id]);
    return result.rows;
}

export async function getAllStocks() {
    const result = await pool.query('SELECT stock_name, price FROM stocks');
    return result.rows;
}

export async function getBalance(user_id: number) {
    const result = await pool.query('SELECT balance FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    return result.rows[0].balance;
}