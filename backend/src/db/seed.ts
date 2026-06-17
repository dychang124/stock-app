import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export async function seed(pool: Pool) {
    // Clear existing data
    await pool.query('DELETE FROM user_stocks');
    await pool.query('DELETE FROM stocks');
    await pool.query('DELETE FROM users');


    // const usernames = faker.helpers.uniqueArray(faker.internet.username, 100);
    // const passwords = faker.helpers.uniqueArray(faker.internet.password, 100);

    // for (let i = 0; i < usernames.length; i++) {
    //     const hashed = await bcrypt.hash(passwords[i]!, 10);
    //     await pool.query('INSERT INTO users(username, password_hash) VALUES($1, $2)', [usernames[i], hashed]);
    // }

    
    const randomPrice = () => Math.round((Math.random() * 999 + 1) * 100) / 100;
    const randomTrueValue = (price: number) => Math.round(price * (1 + (Math.random() * 0.2 - 0.1)) * 100) / 100;

    const stockNames = [
        { stock_name: 'APXO', company_name: 'Apex Technologies Inc.' },
        { stock_name: 'NRVN', company_name: 'Nervana Systems Corp.' },
        { stock_name: 'BLZR', company_name: 'Blazer Energy Ltd.' },
        { stock_name: 'QNTM', company_name: 'Quantum Dynamics Corp.' },
        { stock_name: 'SOLR', company_name: 'Solar Bright Industries' },
        { stock_name: 'DRFT', company_name: 'Driftwood Media Group' },
        { stock_name: 'CRBN', company_name: 'Carbon Logic Inc.' },
        { stock_name: 'PLSM', company_name: 'Plasma Networks Ltd.' },
        { stock_name: 'VRDA', company_name: 'Verda Biotech Corp.' },
        { stock_name: 'MNVR', company_name: 'Maneuver Robotics Inc.' },
        { stock_name: 'GLCR', company_name: 'Glacier Finance Group' },
        { stock_name: 'NXUS', company_name: 'Nexus Computing Ltd.' },
        { stock_name: 'TRNA', company_name: 'Terranova Agriculture' },
        { stock_name: 'HYPX', company_name: 'Hyperex Transport Inc.' },
        { stock_name: 'OCNX', company_name: 'Oceanix Resources Corp.' },
        { stock_name: 'LMNX', company_name: 'Luminex Pharmaceuticals' },
        { stock_name: 'STRM', company_name: 'Stormcloud Analytics' },
        { stock_name: 'FRZN', company_name: 'Frozen Foods Global' },
        { stock_name: 'CRVX', company_name: 'Curvex Engineering Ltd.' },
        { stock_name: 'PRXY', company_name: 'Proxy Defense Systems' },
        { stock_name: 'DUSK', company_name: 'Dusk Entertainment Inc.' },
        { stock_name: 'WNDR', company_name: 'Wander Travel Corp.' },
        { stock_name: 'VLCN', company_name: 'Volcano Mining Ltd.' },
        { stock_name: 'SWFT', company_name: 'Swiftpay Financial' },
        { stock_name: 'ARBN', company_name: 'Arboron Materials Inc.' },
        { stock_name: 'CYPH', company_name: 'Cyphernet Security Corp.' },
        { stock_name: 'NOVA', company_name: 'Novastride Health' },
        { stock_name: 'FLUX', company_name: 'Flux Power Systems' },
        { stock_name: 'RNBW', company_name: 'Rainbow Consumer Goods' },
        { stock_name: 'PEAK', company_name: 'Peak Performance Sports' },
    ];

    const stocks = stockNames.map(({ stock_name, company_name }) => {
        const price = randomPrice();
        return { stock_name, company_name, price, true_value: randomTrueValue(price) };
    });

    for (let i = 0; i < stocks.length; i++) {
        await pool.query('INSERT INTO stocks(stock_name, company_name, price, prev_close, true_value) VALUES($1, $2, $3, $4, $5)', [stocks[i]!.stock_name, stocks[i]!.company_name, stocks[i]!.price, stocks[i]!.price, stocks[i]!.true_value]);
    }
    
}