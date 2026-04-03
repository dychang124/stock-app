import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { buyStock, sellStock } from '../services/stockService';

const router = Router();

router.post('/buy', authMiddleware, async (req, res) => {
    try {
        const { stock_name, quantity } = req.body;
        const user_id = (req as any).user.user_id;
        await buyStock(user_id, stock_name, quantity);
        res.json({ message: 'Stock purchased successfully' });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.post('/sell', authMiddleware, async (req, res) => {
    try {
        const { stock_name, quantity } = req.body;
        const user_id = (req as any).user.user_id;
        await sellStock(user_id, stock_name, quantity);
        res.json({ message: 'Stock sold successfully' });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

export default router;