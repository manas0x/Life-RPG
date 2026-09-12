import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { motion } from 'framer-motion';
import { Clock, Trophy, Coins, Zap, Scroll } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    api.getHistory().then(res=>{ setHistory(res.history); setStats(res.stats); }).finally(()=>setLoading(false));
  },[]);

  if (loading) return <div className="h-64 rounded-2xl bg-obsidian-800 animate-pulse" />;

  return (
    <div>
      <h1 className="font-display font-bold text-2xl flex items-center gap-2"><Scroll className="w-6 h-6 text-ember-400" /> Chronicles</h1>
      <p className="text-sm text-zinc-500">Your sealed quests — immutable history, persisted in the realm’s archive.</p>

      {stats && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-obsidian-800 border border-white/5 p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto text-ember-400" />
            <div className="text-xs font-mono tracking-widest text-zinc-500 mt-1">COMPLETED</div>
            <div className="text-2xl font-black">{stats.tasksCompleted}</div>
          </div>
          <div className="rounded-2xl bg-obsidian-800 border border-white/5 p-4 text-center">
            <Zap className="w-5 h-5 mx-auto text-amber-400" />
            <div className="text-xs font-mono tracking-widest text-zinc-500 mt-1">TOTAL XP</div>
            <div className="text-2xl font-black">{stats.totalXp}</div>
          </div>
          <div className="rounded-2xl bg-obsidian-800 border border-white/5 p-4 text-center">
            <Coins className="w-5 h-5 mx-auto text-yellow-400" />
            <div className="text-xs font-mono tracking-widest text-zinc-500 mt-1">GOLD EARNED</div>
            <div className="text-2xl font-black">{stats.totalGold}</div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {history.length===0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-obsidian-800/30 p-10 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">📜</div>
            <h3 className="font-bold mt-3">No chronicles yet</h3>
            <p className="text-sm text-zinc-500">Complete your first quest and it will be etched here forever.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-obsidian-800/50 overflow-hidden">
            <div className="divide-y divide-white/5">
              {history.map(h=>(
                <motion.div key={h.id} initial={{opacity:0}} animate={{opacity:1}} className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                      {h.attribute==='strength'?'⚔️':h.attribute==='intellect'?'📖':h.attribute==='vitality'?'🌿':h.attribute==='charisma'?'💬':'🎯'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate text-sm">{h.title}</div>
                      <div className="text-xs font-mono text-zinc-500 flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">{h.difficulty}</span>
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> +{h.xp_reward} XP</span>
                        <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> +{h.gold_reward} G</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-zinc-400 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {new Date(h.completed_at).toLocaleDateString()}</div>
                    <div className="text-xs text-zinc-600">{new Date(h.completed_at).toLocaleTimeString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs font-mono text-zinc-600 flex items-center gap-2">
        <Clock className="w-3 h-3" /> Persisted server-side • Survives refresh • Cannot be forged
      </div>
    </div>
  );
}
