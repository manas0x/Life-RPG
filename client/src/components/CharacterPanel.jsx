import { motion } from 'framer-motion';
import { Flame, Coins, Trophy, Zap, Brain, Heart, Users, Target, Dumbbell } from 'lucide-react';

const attrMeta = {
  strength: { label: 'Strength', icon: Dumbbell, color: 'from-red-500 to-orange-500', bg: 'bg-red-500/10', text:'text-red-400' },
  intellect: { label: 'Intellect', icon: Brain, color: 'from-violet-500 to-indigo-500', bg: 'bg-violet-500/10', text:'text-violet-400' },
  vitality: { label: 'Vitality', icon: Heart, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', text:'text-emerald-400' },
  charisma: { label: 'Charisma', icon: Users, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', text:'text-pink-400' },
  discipline: { label: 'Discipline', icon: Target, color: 'from-amber-500 to-yellow-500', bg: 'bg-amber-500/10', text:'text-amber-400' },
};

export default function CharacterPanel({ character }) {
  if (!character) return <div className="h-64 rounded-2xl glass animate-pulse" />;
  const { level, xp, nextXp, gold, streak, longest_streak, strength, intellect, vitality, charisma, discipline, username } = character;
  const attrs = { strength, intellect, vitality, charisma, discipline };
  const maxAttr = Math.max(...Object.values(attrs), 5);
  const progress = Math.min(100, Math.round((xp / nextXp) * 100));

  return (
    <div className="rounded-[20px] overflow-hidden border border-white/[0.06] glass">
      {/* Header */}
      <div className="relative p-5 sm:p-6 bg-gradient-to-br from-obsidian-700 via-obsidian-800 to-obsidian-900">
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-obsidian-700 border border-white/10 flex items-center justify-center text-2xl font-semibold text-zinc-300 relative">
              <span className="relative">{(username || '?')[0].toUpperCase()}</span>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-ember-500 to-amber-600 border-2 border-obsidian-800 flex items-center justify-center text-xs font-black text-white">{level}</div>
            </div>
            <div>
              <h2 className="font-semibold text-lg sm:text-xl leading-tight">{username}</h2>
              <p className="text-sm text-zinc-400">Level {level}</p>
              <div className="flex gap-1.5 mt-2">
                <span className="px-2 py-1 rounded-full bg-ember-500/15 border border-ember-500/20 text-ember-400 text-xs font-mono flex items-center gap-1"><Zap className="w-3 h-3" /> {character.total_xp} XP total</span>
                <span className="hidden sm:inline-flex px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono">{nextXp - xp} to next</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-obsidian-900 font-bold text-sm shadow-lg">
              <Coins className="w-4 h-4" /> {gold}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Gold</p>
          </div>
        </div>

        {/* XP bar */}
        <div className="relative mt-5">
          <div className="flex justify-between text-[11px] text-zinc-500 mb-1.5">
            <span>XP</span><span>{xp} / {nextXp}</span>
          </div>
          <div className="h-3 rounded-full bg-black/40 border border-white/5 p-1 overflow-hidden">
            <motion.div initial={{width:0}} animate={{width: `${progress}%`}} transition={{type:'spring', stiffness:80}} className="h-full rounded-full bg-gradient-to-r from-ember-500 via-amber-500 to-yellow-400 relative overflow-hidden">
              <div className="absolute inset-0 shimmer opacity-30 animate-shimmer" />
            </motion.div>
          </div>
          <div className="h-1.5 mt-1 flex gap-1">
            {[...Array(20)].map((_,i)=> <div key={i} className={`flex-1 rounded-full ${i < Math.round(progress/5) ? 'bg-ember-500/40' : 'bg-white/5'}`} />)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 sm:p-5 grid grid-cols-3 gap-3 border-t border-white/5 bg-obsidian-900/50">
        <Stat icon={Flame} label="Streak" value={`${streak} days`} sub={`Best ${longest_streak}`} highlight={streak>=3} />
        <Stat icon={Trophy} label="Level" value={level} sub={`${xp} / ${nextXp} XP`} />
        <Stat icon={Coins} label="Gold" value={gold} sub="Available" />
      </div>

      {/* Attributes */}
      <div className="p-4 sm:p-5 border-t border-white/5">
        <h3 className="text-xs font-medium text-zinc-500 mb-3">Attributes</h3>
        <div className="space-y-3">
          {Object.entries(attrMeta).map(([key, meta])=>{
            const val = attrs[key];
            const pct = Math.min(100, (val / maxAttr)*100);
            const Icon = meta.icon;
            return (
              <div key={key} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${meta.bg} border border-white/5 flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${meta.text}`} />
                    </div>
                    <span className="text-sm font-medium">{meta.label}</span>
                  </div>
                  <span className="text-sm font-mono font-bold">{val}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden p-0.5">
                  <motion.div initial={{width:0}} animate={{width: `${pct}%`}} transition={{delay:0.1}} className={`h-full rounded-full bg-gradient-to-r ${meta.color}`} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-zinc-500 mt-3">Complete tasks in a category to raise that attribute.</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, highlight }) {
  return (
    <div className={`rounded-2xl p-3 border ${highlight ? 'bg-ember-500/10 border-ember-500/20' : 'bg-white/[0.03] border-white/5'} text-center`}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${highlight ? 'text-ember-400' : 'text-zinc-500'}`} />
      <div className="text-[11px] text-zinc-500">{label}</div>
      <div className={`font-bold ${highlight ? 'text-ember-400' : 'text-white'}`}>{value}</div>
      <div className="text-[11px] text-zinc-500 truncate">{sub}</div>
    </div>
  );
}
