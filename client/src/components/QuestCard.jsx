import { motion } from 'framer-motion';
import { Check, Pencil, Trash2, Clock, Flame, Crown } from 'lucide-react';

const attrIcon = {
  strength: '⚔️', intellect: '📖', vitality: '🌿', charisma: '💬', discipline: '🎯'
};
const attrColor = {
  strength: 'from-red-500/20 to-orange-500/20 border-red-500/20 text-red-300',
  intellect: 'from-violet-500/20 to-indigo-500/20 border-violet-500/20 text-violet-300',
  vitality: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20 text-emerald-300',
  charisma: 'from-pink-500/20 to-rose-500/20 border-pink-500/20 text-pink-300',
  discipline: 'from-amber-500/20 to-yellow-500/20 border-amber-500/20 text-amber-300',
};
const diffMeta = {
  easy: { label:'Easy', color:'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot:'bg-emerald-400' },
  medium: { label:'Medium', color:'bg-blue-500/15 text-blue-400 border-blue-500/20', dot:'bg-blue-400' },
  hard: { label:'Hard', color:'bg-orange-500/15 text-orange-400 border-orange-500/20', dot:'bg-orange-400' },
  epic: { label:'Epic', color:'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-violet-500/30', dot:'bg-white' },
};

export default function QuestCard({ task, onComplete, onEdit, onDelete, completing }) {
  const diff = diffMeta[task.difficulty] || diffMeta.medium;
  return (
    <motion.div
      layout
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative rounded-2xl border bg-obsidian-800/70 backdrop-blur p-4 sm:p-4.5 flex flex-col gap-3 transition ${task.completed ? 'opacity-60 border-white/5' : 'border-white/[0.06] hover:border-white/15 hover:shadow-xl hover:shadow-black/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl border bg-gradient-to-br flex items-center justify-center text-lg ${attrColor[task.attribute]}`}>
            {attrIcon[task.attribute]}
          </div>
          <div>
            <h3 className={`font-semibold leading-tight text-[15px] ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>{task.title}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono border ${diff.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} /> {diff.label}
              </span>
              <span className="text-xs text-zinc-500 font-mono">+{task.xp_reward} XP • +{task.gold_reward} G</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!task.completed && (
            <>
              <button onClick={()=>onEdit(task)} aria-label="Edit quest" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={()=>onDelete(task)} aria-label="Delete quest" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 flex items-center justify-center text-zinc-400 hover:text-red-400 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {task.completed && <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Done</span>}
        </div>
      </div>

      {task.description && <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{task.description}</p>}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(task.created_at).toLocaleDateString()}</span>
        {!task.completed ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={()=>onComplete(task)}
            disabled={completing}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-ember-500 to-amber-500 hover:from-ember-600 hover:to-amber-600 text-obsidian-900 font-bold text-sm flex items-center gap-1.5 shadow-lg shadow-ember-500/20 disabled:opacity-50 transition"
          >
            {completing ? <span className="w-4 h-4 border-2 border-obsidian-900/30 border-t-obsidian-900 rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Complete
          </motion.button>
        ) : (
          <span className="text-xs font-mono text-zinc-600">Sealed {task.completed_at ? new Date(task.completed_at).toLocaleTimeString() : ''}</span>
        )}
      </div>
      {task.difficulty==='epic' && !task.completed && <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 border border-white/20 flex items-center justify-center"><Crown className="w-3 h-3 text-white" /></div>}
    </motion.div>
  );
}
