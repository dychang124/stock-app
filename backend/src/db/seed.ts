import { Pool } from 'pg';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

export async function seed(pool: Pool) {
    // Clear existing data
    await pool.query('DELETE FROM user_stocks');
    await pool.query('DELETE FROM stocks');
    await pool.query('DELETE FROM users');


    const usernames = faker.helpers.uniqueArray(faker.internet.username, 100);
    const passwords = faker.helpers.uniqueArray(faker.internet.password, 100);

    for (let i = 0; i < usernames.length; i++) {
        const hashed = await bcrypt.hash(passwords[i]!, 10);
        await pool.query('INSERT INTO users(username, password_hash) VALUES($1, $2)', [usernames[i], hashed]);
    }

    const stocks = [
        { stock_name: 'APXO', company_name: 'Apex Technologies Inc.', price: 100.00 },
        { stock_name: 'NRVN', company_name: 'Nervana Systems Corp.', price: 100.00 },
        { stock_name: 'BLZR', company_name: 'Blazer Energy Ltd.', price: 100.00 },
        { stock_name: 'QNTM', company_name: 'Quantum Dynamics Corp.', price: 100.00 },
        { stock_name: 'SOLR', company_name: 'Solar Bright Industries', price: 100.00 },
        { stock_name: 'DRFT', company_name: 'Driftwood Media Group', price: 100.00 },
        { stock_name: 'CRBN', company_name: 'Carbon Logic Inc.', price: 100.00 },
        { stock_name: 'PLSM', company_name: 'Plasma Networks Ltd.', price: 100.00 },
        { stock_name: 'VRDA', company_name: 'Verda Biotech Corp.', price: 100.00 },
        { stock_name: 'MNVR', company_name: 'Maneuver Robotics Inc.', price: 100.00 },
        { stock_name: 'GLCR', company_name: 'Glacier Finance Group', price: 100.00 },
        { stock_name: 'NXUS', company_name: 'Nexus Computing Ltd.', price: 100.00 },
        { stock_name: 'TRNA', company_name: 'Terranova Agriculture', price: 100.00 },
        { stock_name: 'HYPX', company_name: 'Hyperex Transport Inc.', price: 100.00 },
        { stock_name: 'OCNX', company_name: 'Oceanix Resources Corp.', price: 100.00 },
        { stock_name: 'LMNX', company_name: 'Luminex Pharmaceuticals', price: 100.00 },
        { stock_name: 'STRM', company_name: 'Stormcloud Analytics', price: 100.00 },
        { stock_name: 'FRZN', company_name: 'Frozen Foods Global', price: 100.00 },
        { stock_name: 'CRVX', company_name: 'Curvex Engineering Ltd.', price: 100.00 },
        { stock_name: 'PRXY', company_name: 'Proxy Defense Systems', price: 100.00 },
        { stock_name: 'DUSK', company_name: 'Dusk Entertainment Inc.', price: 100.00 },
        { stock_name: 'WNDR', company_name: 'Wander Travel Corp.', price: 100.00 },
        { stock_name: 'VLCN', company_name: 'Volcano Mining Ltd.', price: 100.00 },
        { stock_name: 'SWFT', company_name: 'Swiftpay Financial', price: 100.00 },
        { stock_name: 'ARBN', company_name: 'Arboron Materials Inc.', price: 100.00 },
        { stock_name: 'CYPH', company_name: 'Cyphernet Security Corp.', price: 100.00 },
        { stock_name: 'NOVA', company_name: 'Novastride Health', price: 100.00 },
        { stock_name: 'FLUX', company_name: 'Flux Power Systems', price: 100.00 },
        { stock_name: 'RNBW', company_name: 'Rainbow Consumer Goods', price: 100.00 },
        { stock_name: 'PEAK', company_name: 'Peak Performance Sports', price: 100.00 },
    ];
    for (let i = 0; i < stocks.length; i++) {
        await pool.query('INSERT INTO stocks(stock_name, company_name, price, prev_close) VALUES($1, $2, $3, $4)', [stocks[i]!.stock_name, stocks[i]!.company_name, stocks[i]!.price, stocks[i]!.price]);
    }
    
}