import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { getDB } from '../db.js';
import { signToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Username, email and password required' });
  if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' });

  const db = getDB();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const id = uuid();
  const hash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  db.prepare('INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)').run(id, username.trim(), email.toLowerCase(), hash, now);
  db.prepare('INSERT INTO characters (user_id, level, xp, total_xp, gold, streak, longest_streak, last_active_date, strength, intellect, vitality, charisma, discipline) VALUES (?, 1, 0, 0, 50, 0, 0, NULL, 1, 1, 1, 1, 1)').run(id);

  const user = { id, username: username.trim(), email: email.toLowerCase() };
  const token = signToken(user);
  res.json({ token, user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const db = getDB();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const payload = { id: user.id, email: user.email, username: user.username };
  const token = signToken(payload);
  res.json({ token, user: payload });
});

router.get('/me', authMiddleware, (req, res) => {
  const db = getDB();
  const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

export default router;
