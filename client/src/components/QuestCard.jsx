import { motion } from 'framer-motion';
import { Check, Pencil, Trash2, Clock } from 'lucide-react';

const diffMeta = {
  easy:   { label:'Easy',   color:'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot:'bg-emerald-400' },
  medium: { label:'Medium', color:'bg-blue-500/15 text-blue-400 border-blue-500/20', dot:'bg-blue-400' },
  hard:   { label:'Hard',   color:'bg-orange-500/15 text-orange-400 border-orange-500/20', dot:'bg-orange-400' },
  epic:   { label:'Epic',   color:'bg-violet-500/15 text-violet-300 border-violet-500/20', dot:'bg-violet-400' },
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
      className={`relative rounded-2xl border bg-obsidian-800/70 backdrop-blur p-4 flex flex-col gap-3 transition ${task.completed ? 'opacity-60 border-white/5' : 'border-white/[0.06] hover:border-white/15 hover:shadow-xl hover:shadow-black/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`font-semibold leading-tight text-[15px] ${task.completed ? 'line-through text-zinc-500' : 'text-white'}`}>{task.title}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300 capitalize">{task.attribute}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${diff.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} /> {diff.label}
            </span>
            <span className="text-xs text-zinc-500">+{task.xp_reward} XP · +{task.gold_reward} gold</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!task.completed && (
            <>
              <button onClick={()=>onEdit(task)} aria-label="Edit task" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={()=>onDelete(task)} aria-label="Delete task" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 flex items-center justify-center text-zinc-400 hover:text-red-400 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {task.completed && <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Done</span>}
        </div>
      </div>

      {task.description && <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{task.description}</p>}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-zinc-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(task.created_at).toLocaleDateString()}</span>
        {!task.completed ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={()=>onComplete(task)}
            disabled={completing}
            className="px-4 py-2 rounded-full bg-ember-500 hover:bg-ember-600 text-white font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50 transition"
          >
            {completing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Complete
          </motion.button>
        ) : (
          <span className="text-xs text-zinc-600">Completed {task.completed_at ? new Date(task.completed_at).toLocaleTimeString() : ''}</span>
        )}
      </div>
    </motion.div>
  );
}
