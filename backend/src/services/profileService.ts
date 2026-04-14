import pool from '../db/index';

export async function getProfile(user_id: number) {
    const result = await pool.query('SELECT username FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    return result.rows[0];
}

export async function setProfile(user_id: number, username: string) {
    const result = await pool.query('UPDATE users SET username = $1 WHERE user_id = $2 RETURNING username', [username, user_id]);
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }
    return result.rows[0];
}