# Life RPG — Forge Your Legend ⚔️

> Turn mundane habits into epic quests. Earn XP, keep streaks, level attributes, and spend gold in the Armory.

A full-stack, **thematically cohesive dark-fantasy** Life RPG that bridges the delayed-gratification gap of traditional productivity tools. Every checkmark is **tactile, celebratory, and server-authoritative** — no cheating your stats.

![Life RPG Preview](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20SQLite-dark?style=for-the-badge)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-blue)
![RPG](https://img.shields.io/badge/RPG-Non--Linear%20Leveling-gold)

---

## ✨ Product Feel

- **Alive & Tactile** — spring animations (Framer Motion), XP shimmer bars, gold-coin pops, confetti on complete, level-up ascension modal with particles. Optimistic UI + loading skeletons so it feels native.
- **Thematically Cohesive** — obsidian/ember/gold palette, Cinzel display type, sigil icons (⚔️ Strength, 📖 Intellect, 🌿 Vitality, 💬 Charisma, 🎯 Discipline), rarity glows, parchment textures.
- **Seamlessly Integrated** — Vite proxy + Express API, skeletons, `backdrop-blur` glass, transitions. Refresh proves DB persistence.

## 🧩 Core Systems (Checklist)

| Requirement | Implementation |
|---|---|
| **Auth & Security** | JWT (7d) + bcryptjs hashing, `Authorization: Bearer` middleware, users only see own data. SQL-injection safe via prepared statements. |
| **Database & CRUD** | **SQLite (node:sqlite built-in)** with WAL. Tables: `users`, `characters`, `tasks`, `shop_items`, `inventory`, `history`. Full CRUD for quests. |
| **RPG Progression** | **Non-linear** `xpForNext = floor(100 * level^1.6)` — Level 1→2 needs 100, Level 5→6 needs 100*5^1.6≈  ~ 1310. Server is source of truth. |
| **Streaks** | `last_active_date` + `streak`/`longest_streak`. Increments if yesterday was active, resets after miss, holds if multiple quests same day. |
| **Attributes** | 5 stats (Strength/Intellect/Vitality/Charisma/Discipline). Each quest tags one. +1 per completion, shown as animated bars. |
| **Economy** | Gold rewards by difficulty (12/28/55/110) + level-up bonus (50×level). **Armory** shop: 10 items (common→legendary), ownership persisted, no duplicate buys. |
| **Responsive & Accessible** | Mobile-first, 360px → 1280px. Keyboard: Tab/Enter/Space all interactive. `focus-visible` rings, `aria-label`s, semantic HTML, screen-reader labels. |

### Difficulty → Rewards
- Easy: 25 XP / 12 G
- Medium: 55 XP / 28 G
- Hard: 110 XP / 55 G
- Epic: 220 XP / 110 G

---

## 🗂️ Architecture

```
Life-RPG/
├── server/           # Express 4 + node:sqlite (DatabaseSync)
│   ├── index.js      # CORS, static serve, API mount
│   ├── db.js         # Schema, seed, xpForNextLevel, transactions
│   ├── middleware/auth.js
│   └── routes/ {auth, tasks, character, shop, history}.js
├── client/           # Vite + React 18 + Tailwind 3 + Framer Motion
│   ├── src/
│   │   ├── pages/ {AuthPage, Dashboard, Shop, History}.jsx
│   │   ├── components/ {Layout, CharacterPanel, QuestCard, QuestForm, LevelUpModal}.jsx
│   │   ├── context/AuthContext.jsx
│   │   └── lib/api.js
│   └── vite.config.js  # proxy /api → localhost:4000, host 0.0.0.0
└── package.json      # workspaces + concurrently
```

**DB Schema (ER):**
- `users 1—1 characters`
- `users 1—∞ tasks`
- `users 1—∞ inventory ∞—1 shop_items`
- `users 1—∞ history`

Historical logs in `history` + `tasks.completed_at` survive deletes.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ (22 recommended)
- npm 10+

### 1. Clone & Install
```bash
git clone https://github.com/manas0x/Life-RPG.git
cd Life-RPG
npm install
# installs both workspaces (server + client) via npm workspaces
```

### 2. Env
```bash
cp .env.example server/.env
# edit server/.env
# JWT_SECRET=your-super-secret-long-random-string
# PORT=4000 (optional)
```

### 3. Dev (concurrent)
```bash
npm run dev
# server:  http://localhost:4000  (API + health)
# client:  http://localhost:5173  (Vite HMR, proxies /api)
```
Open **http://localhost:5173**. API is proxied; no CORS issues.

### 4. Production
```bash
npm run build --workspace=client
npm start --workspace=server
# serves API + static frontend on PORT (4000)
```

### 5. Fresh DB
Delete `server/data.db` (and `data.db-wal/shm`) and restart — seeds shop items automatically. Gold starts at 50.

---

## 🔐 API Reference

All `/api/*` except `/auth/*` require `Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | {username,email,password} → {token,user} |
| POST | `/api/auth/login` | {email,password} → {token,user} |
| GET | `/api/auth/me` | current user |
| GET | `/api/tasks` | list own tasks |
| POST | `/api/tasks` | create {title,description,attribute,difficulty} |
| PUT | `/api/tasks/:id` | update pending quest |
| DELETE | `/api/tasks/:id` | delete quest |
| POST | `/api/tasks/:id/complete` | **server-authoritative** — awards XP/Gold, levels, streak, attr, history |
| GET | `/api/character` | {character,nextXp,xpProgress,inventory} |
| GET | `/api/shop` | items + owned flag |
| POST | `/api/shop/buy/:id` | spend gold, acquire item |
| GET | `/api/history` | sealed quests log + stats |
| GET | `/api/health` | ok |

**Validation:** title 1-100 chars, description ≤500, attribute ∈ {strength,…}, difficulty ∈ {easy,medium,hard,epic}. Empty titles rejected 400.

---

## 🎮 User Flow (Illustration Video Script - 120s)

1. **0-20s** Signup (`hero@realm.io`) → lands on Dashboard, sees Level 1, 0% XP, 50 Gold.
2. **20-50s** **Forge Quest:** “Morning Run” (Vitality, Hard) → appears with +110 XP badge. Edit to “Morning Run 5k” → save.
3. **50-90s** **Complete** → confetti, +110 XP toast, gold +55, vitality 1→2, XP bar animates. Create + complete “Read 30 pages” (Intellect, Medium) → **Level Up!** modal (crown, particles) → Level 2, bonus gold.
4. **90-110s** **Armory** → buy “Scholar Laurels” badge for 120 G → owned check. Gold deducts.
5. **110-120s** **Refresh** (Ctrl+R) → still Level 2, quests persisted, Chronicles shows 2 sealed entries. Streak =1, Best =1.

Record with OBS, <100MB, 90–180s.

---

## 🎨 Theming & UX Details

- **Typography:** `Cinzel` (display) + `Space Grotesk` (body) + `JetBrains Mono` (stats)
- **Motion:** `framer-motion` `layout`, `whileHover`, `AnimatePresence` for list, modals, toasts. XP bar spring 80.
- **Empty/Edge States:** dashed no-quests card, “Not enough gold” disabled, duplicate purchase blocked, delete confirm, offline `catch` → red toast.
- **Accessibility:** `focus-visible` amber ring, keyboard nav, `aria-label` on icon buttons, logical heading hierarchy, color contrast ≥4.5:1.
- **SEO:** semantic HTML, meta description, responsive viewport, fast Vite build (106kB gz).

---

## 🛡️ Robustness

- Backend validates all input; **level/XP math never trusts client**.
- Completed quests are “sealed” — cannot be edited/undone to farm XP.
- JWT expiry handled (401 → logout).
- Network errors show toasts, not silent fails.
- Transactions (`BEGIN/COMMIT/ROLLBACK`) for complete & purchase.

---

## 🚢 Deploy

- **Client:** Vercel (`vite build` output `client/dist`)
- **Server:** Render/Railway/Fly (`npm start` serves `client/dist` static). Set `JWT_SECRET` env and `PORT`.

Example `render.yaml`:
```yaml
services:
  - type: web
    name: life-rpg
    env: node
    buildCommand: npm install && npm run build --workspace=client
    startCommand: npm start --workspace=server
    envVars:
      - key: JWT_SECRET
        generateValue: true
```

---

## 📸 Screenshots

- Dashboard with CharacterPanel + Quest Log
- Level Up ascension modal
- Armory rarity cards
- Chronicles history

---

## 📄 License

MIT — do what you want, just keep the legend alive.

---

*Built with ❤️ for dreamers who ship. Small quests, stacked daily, forge legends.*
