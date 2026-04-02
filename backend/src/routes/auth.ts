import { Router } from 'express';
import { register } from '../services/authService';
import { login } from '../services/authService';

const router = Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await register(username, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const token = await login(username, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });    
    }
});

export default router;