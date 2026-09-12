import express from 'express';
import { v4 as uuid } from 'uuid';
import { getDB } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = getDB();
  const items = db.prepare('SELECT * FROM shop_items ORDER BY price ASC').all();
  const owned = db.prepare('SELECT item_id FROM inventory WHERE user_id=?').all(req.user.id).map(r=>r.item_id);
  res.json({ items: items.map(i=>({...i, owned: owned.includes(i.id)})) });
});

router.post('/buy/:id', (req, res) => {
  const db = getDB();
  const item = db.prepare('SELECT * FROM shop_items WHERE id=?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const char = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
  const already = db.prepare('SELECT id FROM inventory WHERE user_id=? AND item_id=?').get(req.user.id, item.id);
  if (already) return res.status(400).json({ error: 'Already owned' });
  if (char.gold < item.price) return res.status(400).json({ error: `Not enough gold. Need ${item.price}, have ${char.gold}` });

  const result = db.transaction(() => {
    db.prepare('UPDATE characters SET gold = gold - ? WHERE user_id=?').run(item.price, req.user.id);
    const invId = uuid();
    const now = new Date().toISOString();
    db.prepare('INSERT INTO inventory (id, user_id, item_id, purchased_at) VALUES (?, ?, ?, ?)').run(invId, req.user.id, item.id, now);
    const updatedChar = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
    return updatedChar;
  })();

  res.json({ success: true, character: result, item });
});

export default router;
