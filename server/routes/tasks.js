import express from 'express';
import { v4 as uuid } from 'uuid';
import { getDB, xpForNextLevel } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

const ATTRIBUTES = ['strength','intellect','vitality','charisma','discipline'];
const DIFFICULTIES = {
  easy: { xp: 25, gold: 12 },
  medium: { xp: 55, gold: 28 },
  hard: { xp: 110, gold: 55 },
  epic: { xp: 220, gold: 110 },
};

function validateTask(body) {
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) return 'Title is required';
  if (body.title.trim().length > 100) return 'Title must be under 100 characters';
  if (body.description && body.description.length > 500) return 'Description must be under 500 characters';
  if (!ATTRIBUTES.includes(body.attribute)) return 'Invalid attribute';
  if (!Object.keys(DIFFICULTIES).includes(body.difficulty)) return 'Invalid difficulty';
  return null;
}

router.get('/', (req, res) => {
  const db = getDB();
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY completed ASC, created_at DESC').all(req.user.id);
  res.json({ tasks });
});

router.post('/', (req, res) => {
  const err = validateTask(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, description = '', attribute, difficulty } = req.body;
  const rewards = DIFFICULTIES[difficulty];
  const id = uuid();
  const now = new Date().toISOString();
  const db = getDB();
  db.prepare('INSERT INTO tasks (id, user_id, title, description, attribute, difficulty, xp_reward, gold_reward, completed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)')
    .run(id, req.user.id, title.trim(), description.trim(), attribute, difficulty, rewards.xp, rewards.gold, now);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(201).json({ task });
});

router.put('/:id', (req, res) => {
  const db = getDB();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  if (existing.completed) return res.status(400).json({ error: 'Cannot edit completed task' });
  const err = validateTask(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, description = '', attribute, difficulty } = req.body;
  const rewards = DIFFICULTIES[difficulty];
  db.prepare('UPDATE tasks SET title=?, description=?, attribute=?, difficulty=?, xp_reward=?, gold_reward=? WHERE id=?')
    .run(title.trim(), description.trim(), attribute, difficulty, rewards.xp, rewards.gold, req.params.id);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json({ task });
});

router.delete('/:id', (req, res) => {
  const db = getDB();
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.post('/:id/complete', (req, res) => {
  const db = getDB();
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.completed) return res.status(400).json({ error: 'Task already completed' });

  const now = new Date();
  const nowISO = now.toISOString();
  const todayStr = now.toISOString().slice(0,10);

  // Transaction: update task, character, history, streak
  const result = db.transaction(() => {
    // mark task completed
    db.prepare('UPDATE tasks SET completed=1, completed_at=? WHERE id=?').run(nowISO, task.id);

    // history log
    const hid = uuid();
    db.prepare('INSERT INTO history (id, user_id, task_id, title, attribute, difficulty, xp_reward, gold_reward, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(hid, req.user.id, task.id, task.title, task.attribute, task.difficulty, task.xp_reward, task.gold_reward, nowISO);

    // character progression
    let char = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
    let { level, xp, total_xp, gold, streak, longest_streak, last_active_date } = char;
    // streak logic
    let newStreak = streak;
    if (!last_active_date) {
      newStreak = 1;
    } else {
      const last = last_active_date.slice(0,10);
      if (last === todayStr) {
        // same day, no streak change (already counted today)
        newStreak = streak === 0 ? 1 : streak;
      } else {
        const yesterday = new Date(now); yesterday.setDate(yesterday.getDate()-1);
        const yStr = yesterday.toISOString().slice(0,10);
        if (last === yStr) newStreak = streak + 1;
        else if (last < yStr) newStreak = 1; // missed days
      }
    }
    if (newStreak > longest_streak) longest_streak = newStreak;

    // attribute increase
    const attrField = task.attribute; // strength etc
    // xp & gold
    let newXp = xp + task.xp_reward;
    let newTotalXp = total_xp + task.xp_reward;
    let newGold = gold + task.gold_reward;
    let newLevel = level;
    let leveledUp = false;
    let levelsGained = 0;
    // level up loop non-linear
    while (newXp >= xpForNextLevel(newLevel)) {
      newXp -= xpForNextLevel(newLevel);
      newLevel += 1;
      leveledUp = true;
      levelsGained += 1;
      // bonus gold on level up
      newGold += 50 * newLevel;
    }
    // attribute increment: +1 per completed task, bonus on level up
    const attrIncrement = 1;
    const newAttrValue = char[attrField] + attrIncrement;

    db.prepare(`UPDATE characters SET level=?, xp=?, total_xp=?, gold=?, streak=?, longest_streak=?, last_active_date=?, ${attrField}=? WHERE user_id=?`)
      .run(newLevel, newXp, newTotalXp, newGold, newStreak, longest_streak, nowISO, newAttrValue, req.user.id);

    char = db.prepare('SELECT * FROM characters WHERE user_id=?').get(req.user.id);
    return { char, leveledUp, levelsGained, rewards: { xp: task.xp_reward, gold: task.gold_reward } };
  })();

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id=?').get(task.id);

  res.json({
    task: updatedTask,
    character: result.char,
    leveledUp: result.leveledUp,
    levelsGained: result.levelsGained,
    rewards: result.rewards
  });
});

router.post('/:id/uncomplete', (req, res) => {
  // Allow uncomplete for undo, but reverses rewards? For anti-cheat, we prevent farming by not reversing XP arbitrarily? But spec says handle edge cases.
  // We'll allow uncomplete only if completed_at is within 5 minutes? Simplify: not allowed to uncomplete - return error.
  // But to be user-friendly, allow toggle with reversal.
  const db = getDB();
  const task = db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (!task.completed) return res.status(400).json({ error: 'Task not completed' });
  // For now, disallow to prevent cheating xp
  return res.status(400).json({ error: 'Completed tasks cannot be undone.' });
});

export default router;
