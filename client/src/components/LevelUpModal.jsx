import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Coins, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LevelUpModal({ open, onClose, level, rewards }) {
  const [particles, setParticles] = useState([]);
  useEffect(()=>{
    if (open) setParticles([...Array(20)].map((_,i)=>({ id:i, x: Math.random()*100, delay: Math.random()*0.5 })));
  }, [open]);

  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <motion.div
          initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.9, opacity:0 }}
          className="relative w-full max-w-[420px] rounded-[24px] overflow-hidden border border-amber-500/20 bg-gradient-to-br from-obsidian-800 via-obsidian-800 to-amber-950/30 shadow-2xl"
        >
          {/* particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p=>(
              <motion.div key={p.id} initial={{ y: 80, opacity:0, x: `${p.x}%` }} animate={{ y:-20, opacity:1 }} transition={{ delay:p.delay, duration:1.2 }} className="absolute bottom-0 w-1 h-8 bg-gradient-to-t from-amber-400 to-transparent rounded-full blur-[0.5px]" />
            ))}
          </div>

          <div className="relative p-8 text-center">
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, delay:0.2 }} className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30 border border-white/20">
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="mt-4">
              <p className="text-xs font-mono tracking-[0.3em] text-amber-400">ASCENSION</p>
              <h2 className="font-display font-black text-3xl mt-1 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">LEVEL UP!</h2>
              <p className="font-display text-5xl font-black mt-1">{level}</p>
              <p className="text-sm text-zinc-400 mt-2">You have transcended. New power surges through you.</p>
            </motion.div>

            {rewards && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col items-center gap-1">
                  <Zap className="w-5 h-5 text-amber-400" /><span className="text-xs font-mono text-zinc-500">XP GAINED</span><span className="font-bold">+{rewards.xp}</span>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col items-center gap-1">
                  <Coins className="w-5 h-5 text-amber-400" /><span className="text-xs font-mono text-zinc-500">GOLD</span><span className="font-bold">+{rewards.gold}</span>
                </div>
              </div>
            )}

            <motion.button whileTap={{scale:0.98}} onClick={onClose} className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-obsidian-900 font-black shadow-lg flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Continue Adventure
            </motion.button>
            <p className="text-[11px] font-mono text-zinc-600 mt-3">Press ESC or tap outside to close</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
