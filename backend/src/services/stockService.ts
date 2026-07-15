import pool from '../db/index';

export async function buyStock(user_id: number, stock_name: string, quantity: number)
{
    const stockResult = await pool.query('SELECT * FROM stocks WHERE stock_name = $1', [stock_name]);
    if (stockResult.rows.length === 0) {
        throw new Error('Stock not found');
    }
    const stock = stockResult.rows[0];
    const totalCost = stock.price * quantity;

    await pool.query('BEGIN');
    try {
        const userResult = await pool.query('SELECT balance FROM users WHERE user_id = $1 FOR UPDATE', [user_id]);
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }
        if (userResult.rows[0].balance < totalCost) {
            throw new Error('Insufficient balance');
        }

        await pool.query('UPDATE users SET balance = balance - $1 WHERE user_id = $2', [totalCost, user_id]);
        await pool.query('INSERT INTO user_stocks (user_id, stock_name, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, stock_name) DO UPDATE SET quantity = user_stocks.quantity + EXCLUDED.quantity;', [user_id, stock.stock_name, quantity]);
        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
}

export async function sellStock(user_id: number, stock_name: string, quantity: number)
{
    const stockResult = await pool.query('SELECT * FROM stocks WHERE stock_name = $1', [stock_name]);
    if (stockResult.rows.length === 0) {
        throw new Error('Stock not found');
    }
    const stock = stockResult.rows[0];
    const totalRevenue = stock.price * quantity;

    await pool.query('BEGIN');
    try {
        const userStockResult = await pool.query('SELECT quantity FROM user_stocks WHERE user_id = $1 AND stock_name = $2 FOR UPDATE', [user_id, stock_name]);
        if (userStockResult.rows.length === 0 || userStockResult.rows[0].quantity < quantity) {
            throw new Error('Not enough stocks to sell');
        }

        await pool.query('UPDATE users SET balance = balance + $1 WHERE user_id = $2', [totalRevenue, user_id]);
        await pool.query('UPDATE user_stocks SET quantity = quantity - $1 WHERE user_id = $2 AND stock_name = $3', [quantity, user_id, stock_name]);
        if (userStockResult.rows[0].quantity === quantity) {
            await pool.query('DELETE FROM user_stocks WHERE user_id = $1 AND stock_name = $2', [user_id, stock_name]);
        }

        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
    }
}