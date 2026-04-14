import { Router } from 'express';
import { getProfile, setProfile } from '../services/profileService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const user_id = (req as any).user.user_id;
        const profile = await getProfile(user_id);
        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const user_id = (req as any).user.user_id;
        const { username } = req.body;
        const profile = await setProfile(user_id, username);
        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

export default router;