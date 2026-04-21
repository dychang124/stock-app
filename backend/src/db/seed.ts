import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
// @ts-ignore
import FinnhubClient from 'finnhub';

export async function seed(pool: Pool) {
    // Clear existing data
    await pool.query('DELETE FROM user_stocks');
    await pool.query('DELETE FROM stocks');
    await pool.query('DELETE FROM users');


    const usernames = faker.helpers.uniqueArray(faker.internet.username, 1000);
    const passwords = faker.helpers.uniqueArray(faker.internet.password, 1000);

    for (let i = 0; i < 1000; i++) {
        const hashed = await bcrypt.hash(passwords[i]!, 10);
        await pool.query('INSERT INTO users(username, password_hash) VALUES($1, $2)', [usernames[i], hashed]);
    }

    const api_key = FinnhubClient.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_KEY;
    const finnhubClient = new FinnhubClient.DefaultApi();
    
}