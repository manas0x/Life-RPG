import express from 'express';
import { getDB } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = getDB();
  const logs = db.prepare('SELECT * FROM history WHERE user_id=? ORDER BY completed_at DESC LIMIT 100').all(req.user.id);
  const tasksCompleted = logs.length;
  const totalXp = logs.reduce((a,b)=>a+b.xp_reward,0);
  const totalGold = logs.reduce((a,b)=>a+b.gold_reward,0);
  res.json({ history: logs, stats: { tasksCompleted, totalXp, totalGold } });
});
export default router;
