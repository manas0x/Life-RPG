import express from 'express';
import { getDB, xpForNextLevel } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = getDB();
  let char = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
  if (!char) {
    db.prepare('INSERT INTO characters (user_id, level, xp, total_xp, gold, streak, longest_streak, strength, intellect, vitality, charisma, discipline) VALUES (?, 1, 0, 0, 50, 0, 0, 1,1,1,1,1)').run(req.user.id);
    char = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
  }
  const nextXp = xpForNextLevel(char.level);
  const xpProgress = char.xp / nextXp;
  const user = db.prepare('SELECT username, email FROM users WHERE id=?').get(req.user.id);
  const inventory = db.prepare('SELECT shop_items.* FROM inventory JOIN shop_items ON inventory.item_id=shop_items.id WHERE inventory.user_id=?').all(req.user.id);
  res.json({ character: { ...char, nextXp, xpProgress, username: user.username, email: user.email }, inventory });
});

router.post('/check-streak', (req, res) => {
  const db = getDB();
  const char = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
  if (!char) return res.status(404).json({ error: 'Character not found' });
  const today = new Date().toISOString().slice(0,10);
  const last = char.last_active_date ? char.last_active_date.slice(0,10) : null;
  let activeToday = last === today;
  let wouldReset = false;
  if (last && last !== today) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = yesterday.toISOString().slice(0,10);
    if (last < yStr) wouldReset = true; // streak would reset on next completion
  }
  res.json({ streak: char.streak, longestStreak: char.longest_streak, lastActive: last, activeToday, wouldReset });
});

export default router;
