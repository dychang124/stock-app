import { seed } from './seed';
import pool from './index';

seed(pool).then(() => {
    console.log('Seed complete');
    pool.end();
});