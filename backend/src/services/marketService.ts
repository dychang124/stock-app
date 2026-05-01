import cron from 'node-cron';
import pool from '../db/index';


cron.schedule('* * * * *', () => {
    // runs at 5pm every weekday
    updateMarket();
});

export const updateMarket = async () => {
    console.log('Updating market prices...');
    await pool.query('BEGIN');
    try {
        const result = await pool.query('SELECT stock_name, price, true_value FROM stocks');
        const stocks = result.rows;
        for (const stock of stocks) {
            const { stock_name, price, true_value } = stock;
            const diff = true_value - price;
            let news: string | null = null;
            let change: number;
            let trueChange: number;
            const newsNum = Math.floor(Math.random() * 100);
            if (diff >= price * 0.2) {
                if (newsNum <= 5) {
                    news = "Very Bad News";
                }
                else if (newsNum <= 15) {
                    news = "Bad News";
                }
                else if (newsNum <= 30) {
                    news = "Neutral News";
                }
                else if (newsNum <= 60) {
                    news = "Good News";
                }
                else {
                    news = "Very Good News";
                }
            }
            else if (diff < price * 0.2 && diff >= price * 0.05) {
                if (newsNum <= 10) {
                    news = "Very Bad News";
                }
                else if (newsNum <= 20) {
                    news = "Bad News";
                }
                else if (newsNum <= 40) {
                    news = "Neutral News";
                }
                else if (newsNum <= 70) {
                    news = "Good News";
                }
                else {
                    news = "Very Good News";
                }
            }
            else if (diff < price * 0.05 && diff >= price * -0.05) {
                if (newsNum <= 15) {
                    news = "Very Bad News";
                }
                else if (newsNum <= 30) {
                    news = "Bad News";
                }
                else if (newsNum <= 55) {
                    news = "Neutral News";
                }
                else if (newsNum <= 80) {
                    news = "Good News";
                }
                else {
                    news = "Very Good News";
                }
            }
            else if (diff < price * -0.05 && diff >= price * -0.2) {
                if (newsNum <= 20) {
                    news = "Very Bad News";
                }
                else if (newsNum <= 40) {
                    news = "Bad News";
                }
                else if (newsNum <= 65) {
                    news = "Neutral News";
                }
                else if (newsNum <= 85) {
                    news = "Good News";
                }
                else {
                    news = "Very Good News";
                }
            }
            else {
                if (newsNum <= 25) {
                    news = "Very Bad News";
                }
                else if (newsNum <= 50) {
                    news = "Bad News";
                }
                else if (newsNum <= 75) {
                    news = "Neutral News";
                }
                else if (newsNum <= 90) {
                    news = "Good News";
                }
                else {
                    news = "Very Good News";
                }
            }

            if (news === "Very Bad News") {
                change = Math.random() * -0.02 - 0.03;
                if (diff < price * -0.25) {
                    trueChange = Math.random() * -0.02 - 0.03;
                }
                else {
                    trueChange = Math.random() * -0.05 - 0.05;
                }
            }
            else if (news === "Bad News") {
                change = Math.random() * -0.02 - 0.01;
                if (diff < price * -0.15) {
                    trueChange = Math.random() * -0.02 - 0.01;
                }
                else {
                    trueChange = Math.random() * -0.02 - 0.03;
                }
            }
            else if (news === "Neutral News") {
                change = Math.random() * 0.01 - 0.005;
                trueChange = Math.random() * 0.01 - 0.005;
            }
            else if (news === "Good News") {
                change = Math.random() * 0.02 + 0.01;
                if (diff > price * 0.15) {
                    trueChange = Math.random() * 0.02 + 0.01;
                }
                else {
                    trueChange = Math.random() * 0.02 + 0.03;
                }
            }
            else {
                change = Math.random() * 0.02 + 0.03;
                if (diff > price * 0.25) {
                    trueChange = Math.random() * 0.02 + 0.03;
                }
                else {
                    trueChange = Math.random() * 0.05 + 0.05;
                }
            }
            const shock = Math.random() < 0.1 ? (Math.random() * 2 + 1) : 1;
            change = change * shock;
            trueChange = trueChange * shock;

            const newPrice = Math.max(1, price * (1 + change));
            const newTrueValue = Math.max(1, true_value * (1 + trueChange));

            if (newPrice > 1000) {
                await pool.query(
                    'UPDATE stocks SET price = $1, true_value = $2, prev_close = $3, sentiment = $4 WHERE stock_name = $5',
                    [newPrice / 10, newTrueValue / 10, price, news, stock_name]
                );
                await pool.query('UPDATE user_stocks SET quantity = quantity * 10 WHERE stock_name = $1', [stock_name]);
            } else {
                await pool.query(
                    'UPDATE stocks SET price = $1, true_value = $2, prev_close = $3, sentiment = $4 WHERE stock_name = $5',
                    [newPrice, newTrueValue, price, news, stock_name]
                );
            }
        }
        await pool.query('COMMIT');
    
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating market:', error);
    }
}