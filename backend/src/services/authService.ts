import pool from '../db/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(username: string, password: string) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
       throw new Error('Username already taken');
    }
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await pool.query('INSERT INTO users(username, password_hash) VALUES($1, $2) RETURNING *', [username, hashed]);
    const token = jwt.sign({ user_id: newUser.rows[0].user_id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return token;
}
export async function login(username: string, password: string) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
        throw new Error('Invalid username or password');
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        throw new Error('Invalid username or password');
    }
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return token;
}