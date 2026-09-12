import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel's filesystem is read-only except /tmp — use /tmp/data.db there, local server/data.db otherwise
const isVercel = !!process.env.VERCEL;
const dbPath = isVercel ? path.join('/tmp', 'data.db') : path.join(__dirname, 'data.db');
let db;

export function getDB() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

// XP required for next level: non-linear 100 * level^1.6 floored
export function xpForNextLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.6));
}
export function xpForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForNextLevel(i);
  return total;
}

function transaction(fn) {
  return (...args) => {
    db.exec('BEGIN IMMEDIATE');
    try {
      const result = fn(...args);
      db.exec('COMMIT');
      return result;
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch {}
      throw e;
    }
  };
}

export function initDB() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  db = new DatabaseSync(dbPath);
  // Enable WAL and foreign keys (WAL may fail on /tmp, ignore)
  try { db.exec('PRAGMA journal_mode = WAL'); } catch {}
  try { db.exec('PRAGMA foreign_keys = ON'); } catch {}

  // Add transaction helper to db object to keep old API compat
  db.transaction = transaction;

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS characters (
      user_id TEXT PRIMARY KEY,
      level INTEGER NOT NULL DEFAULT 1,
      xp INTEGER NOT NULL DEFAULT 0,
      total_xp INTEGER NOT NULL DEFAULT 0,
      gold INTEGER NOT NULL DEFAULT 0,
      streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT,
      strength INTEGER NOT NULL DEFAULT 1,
      intellect INTEGER NOT NULL DEFAULT 1,
      vitality INTEGER NOT NULL DEFAULT 1,
      charisma INTEGER NOT NULL DEFAULT 1,
      discipline INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      attribute TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      xp_reward INTEGER NOT NULL,
      gold_reward INTEGER NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS shop_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      icon TEXT NOT NULL,
      category TEXT NOT NULL,
      rarity TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      purchased_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE,
      UNIQUE(user_id, item_id)
    );
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      task_id TEXT,
      title TEXT NOT NULL,
      attribute TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      xp_reward INTEGER NOT NULL,
      gold_reward INTEGER NOT NULL,
      completed_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // seed shop items if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM shop_items').get().c;
  if (count === 0) {
    const items = [
      ['relic-ember', 'Ember Sigil', 'A glowing sigil forged in dragonfire. +5% XP aura (cosmetic).', 150, '🔥', 'relic', 'rare'],
      ['relic-frost', 'Frostward Crest', 'Ancient crest of the northern wardens. Chills enemies.', 200, '❄️', 'relic', 'rare'],
      ['badge-scholar', 'Scholar Laurels', 'Awarded to those who master intellect. Profile badge.', 120, '📚', 'badge', 'common'],
      ['badge-titan', 'Titan Bracers', 'Bracers of a titan. Earned by strength.', 120, '🛡️', 'badge', 'common'],
      ['badge-wayfarer', 'Wayfarer Compass', 'For the disciplined wanderer.', 100, '🧭', 'badge', 'common'],
      ['theme-obsidian', 'Obsidian Theme', 'Unlock Obsidian veil - a darker, sharper UI.', 250, '🌑', 'theme', 'epic'],
      ['theme-aurora', 'Aurora Theme', 'Iridescent dawn theme for the hopeful.', 250, '🌌', 'theme', 'epic'],
      ['potion-swift', 'Potion of Swiftness', 'Streak freeze - protect your streak for 1 missed day.', 300, '🧪', 'consumable', 'rare'],
      ['crown-ascendant', 'Crown of Ascendant', 'Legendary crown. Only for true legends.', 1000, '👑', 'relic', 'legendary'],
      ['pet-wisp', 'Wisp Companion', 'A tiny wisp that follows your cursor. Purely delightful.', 400, '✨', 'companion', 'epic'],
    ];
    const stmt = db.prepare('INSERT INTO shop_items (id, name, description, price, icon, category, rarity) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const insertMany = db.transaction((rows) => { for (const r of rows) stmt.run(...r); });
    insertMany(items);
    console.log('Seeded shop items');
  }

  // migrations: ensure columns exist for old DBs
  try {
    const cols = db.prepare("PRAGMA table_info(characters)").all().map(c=>c.name);
    if (!cols.includes('longest_streak')) db.exec("ALTER TABLE characters ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0");
  } catch {}

  console.log('DB initialized at', dbPath);
}
