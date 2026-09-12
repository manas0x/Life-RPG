import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Coins, Zap } from 'lucide-react';
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
          initial={{ scale:0.94, opacity:0, y:16 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.94, opacity:0 }}
          transition={{ type:'spring', stiffness:220, damping:22 }}
          className="relative w-full max-w-[400px] rounded-2xl overflow-hidden border border-amber-500/20 bg-obsidian-800 shadow-2xl"
        >
          {/* particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p=>(
              <motion.div key={p.id} initial={{ y: 80, opacity:0, x: `${p.x}%` }} animate={{ y:-20, opacity:1 }} transition={{ delay:p.delay, duration:1.2 }} className="absolute bottom-0 w-1 h-8 bg-gradient-to-t from-amber-400 to-transparent rounded-full blur-[0.5px]" />
            ))}
          </div>

          <div className="relative p-8 text-center">
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, delay:0.15 }} className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.25}} className="mt-4">
              <p className="text-xs font-medium text-amber-400">Level up</p>
              <h2 className="text-2xl font-bold mt-1">You reached level {level}</h2>
              <p className="text-sm text-zinc-400 mt-2">The next level takes a bit more XP. Keep going.</p>
            </motion.div>

            {rewards && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center gap-1">
                  <Zap className="w-5 h-5 text-amber-400" /><span className="text-xs text-zinc-500">XP gained</span><span className="font-semibold">+{rewards.xp}</span>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col items-center gap-1">
                  <Coins className="w-5 h-5 text-amber-400" /><span className="text-xs text-zinc-500">Gold</span><span className="font-semibold">+{rewards.gold}</span>
                </div>
              </div>
            )}

            <motion.button whileTap={{scale:0.98}} onClick={onClose} className="mt-6 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition">
              Continue
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
