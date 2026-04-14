import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getAllStocks, getUserStocks, getBalance, getUsername } from '../services/listService';

const router = Router();

router.get('/user-stocks', authMiddleware, async (req, res) => {
    try {
        const user_id = (req as any).user.user_id;
        const stocks = await getUserStocks(user_id);
        res.json(stocks);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.get('/all-stocks', async (req, res) => {
    try {
        const stocks = await getAllStocks();
        res.json(stocks);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user_id = (req as any).user.user_id;
        const balance = await getBalance(user_id);
        res.json({ balance });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.get('/username', authMiddleware, async (req, res) => {
    try {
        const user_id = (req as any).user.user_id;
        const username = await getUsername(user_id);
        res.json({ username });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

export default router;