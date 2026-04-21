import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { register, login, setUsername, setPassword } from '../services/authService';

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

router.post('/set-username', authMiddleware, async (req, res) => {
    const user_id = (req as any).user.user_id;
    const { new_username } = req.body;
    try {
        await setUsername(user_id, new_username);
        res.json({ message: 'Username updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });    
    }
});

router.post('/set-password', authMiddleware, async (req, res) => {
    const user_id = (req as any).user.user_id;
    const { new_password } = req.body;
    try {
        await setPassword(user_id, new_password);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });    
    }
});

export default router;