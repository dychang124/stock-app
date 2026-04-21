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

export async function setUsername(user_id: number, new_username: string) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [new_username]);
    if (result.rows.length > 0) {
       throw new Error('Username already taken');
    }
    const result2 = await pool.query('UPDATE users SET username = $1 WHERE user_id = $2 RETURNING username', [new_username, user_id]);
    if (result2.rows.length === 0) {
        throw new Error('User not found');
    }
    return result2.rows[0];
}

export async function setPassword(user_id: number, new_password: string) {
    const result = await pool.query('SELECT password_hash FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    else if (await bcrypt.compare(new_password, result.rows[0].password_hash)) {
        throw new Error('New password cannot be the same as the old password');
    }
    const hashed = await bcrypt.hash(new_password, 10);
    const result2 = await pool.query('UPDATE users SET password_hash = $1 WHERE user_id = $2 RETURNING username', [hashed, user_id]);
    if (result2.rows.length === 0) {
        throw new Error('User not found');
    }
    return result2.rows[0];
}