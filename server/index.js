import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import characterRoutes from './routes/character.js';
import shopRoutes from './routes/shop.js';
import historyRoutes from './routes/history.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Initialize DB
initDB();

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/history', historyRoutes);

// Serve frontend in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
// SPA fallback - only for non-api routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) res.status(404).json({ error: 'Frontend not built. Run npm run build in client.' });
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚔️  Life RPG Server running on http://0.0.0.0:${PORT}`);
});
