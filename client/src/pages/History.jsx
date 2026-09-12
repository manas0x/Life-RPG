import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { motion } from 'framer-motion';
import { Clock, Trophy, Coins, Zap, ListChecks } from 'lucide-react';

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
      <h1 className="font-semibold text-2xl flex items-center gap-2"><ListChecks className="w-6 h-6 text-ember-400" /> History</h1>
      <p className="text-sm text-zinc-500">Every task you have completed, newest first.</p>

      {stats && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-obsidian-800 border border-white/5 p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto text-ember-400" />
            <div className="text-xs text-zinc-500 mt-1">Completed</div>
            <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
          </div>
          <div className="rounded-2xl bg-obsidian-800 border border-white/5 p-4 text-center">
            <Zap className="w-5 h-5 mx-auto text-amber-400" />
            <div className="text-xs text-zinc-500 mt-1">Total XP</div>
            <div className="text-2xl font-bold">{stats.totalXp}</div>
          </div>
          <div className="rounded-2xl bg-obsidian-800 border border-white/5 p-4 text-center">
            <Coins className="w-5 h-5 mx-auto text-yellow-400" />
            <div className="text-xs text-zinc-500 mt-1">Gold earned</div>
            <div className="text-2xl font-bold">{stats.totalGold}</div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {history.length===0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-obsidian-800/30 p-10 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500"><ListChecks className="w-5 h-5" /></div>
            <h3 className="font-semibold mt-3">No history yet</h3>
            <p className="text-sm text-zinc-500">Complete a task and it will show up here.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-obsidian-800/50 overflow-hidden">
            <div className="divide-y divide-white/5">
              {history.map(h=>(
                <motion.div key={h.id} initial={{opacity:0}} animate={{opacity:1}} className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <div className="font-medium truncate text-sm">{h.title}</div>
                      <div className="text-xs font-mono text-zinc-500 flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 capitalize">{h.difficulty}</span>
                        <span className="capitalize">{h.attribute}</span>
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
        <Clock className="w-3 h-3" /> Saved on the server — refreshing will not lose your history.
      </div>
    </div>
  );
}
