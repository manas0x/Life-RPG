import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const attributes = [
  { id:'strength', label:'Strength', icon:'⚔️', desc:'Body' },
  { id:'intellect', label:'Intellect', icon:'📖', desc:'Study' },
  { id:'vitality', label:'Vitality', icon:'🌿', desc:'Health' },
  { id:'charisma', label:'Charisma', icon:'💬', desc:'Social' },
  { id:'discipline', label:'Discipline', icon:'🎯', desc:'Focus' },
];
const difficulties = [
  { id:'easy', label:'Easy', xp:25, gold:12, color:'emerald' },
  { id:'medium', label:'Medium', xp:55, gold:28, color:'blue' },
  { id:'hard', label:'Hard', xp:110, gold:55, color:'orange' },
  { id:'epic', label:'Epic', xp:220, gold:110, color:'violet' },
];

export default function QuestForm({ open, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attribute, setAttribute] = useState('discipline');
  const [difficulty, setDifficulty] = useState('medium');
  const [error, setError] = useState('');

  useEffect(()=>{
    if (open) {
      if (initial) {
        setTitle(initial.title||''); setDescription(initial.description||''); setAttribute(initial.attribute||'discipline'); setDifficulty(initial.difficulty||'medium');
      } else {
        setTitle(''); setDescription(''); setAttribute('discipline'); setDifficulty('medium');
      }
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (title.trim().length > 100) { setError('Title too long'); return; }
    onSubmit({ title: title.trim(), description: description.trim(), attribute, difficulty });
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.form
          initial={{ y: 40, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:40, opacity:0 }}
          onSubmit={handleSubmit}
          className="relative w-full sm:max-w-[560px] max-h-[90vh] overflow-auto rounded-t-[20px] sm:rounded-[20px] bg-obsidian-800 border border-white/10 shadow-2xl"
        >
          <div className="sticky top-0 bg-obsidian-800 p-5 sm:p-6 border-b border-white/5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">{initial ? 'Edit task' : 'New task'}</h2>
              <p className="text-sm text-zinc-500">Add a title, then pick a category and difficulty.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {error && <div className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Title</label>
              <input
                autoFocus
                value={title}
                onChange={e=>setTitle(e.target.value)}
                placeholder="e.g., Read 30 pages, Morning run, Code for 1 hour"
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/10 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20 outline-none text-sm placeholder:text-zinc-600"
              />
              <div className="text-right text-xs font-mono text-zinc-600 mt-1">{title.length}/100</div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={e=>setDescription(e.target.value)}
                placeholder="Add details, notes, or acceptance criteria..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/10 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20 outline-none text-sm placeholder:text-zinc-600 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block">Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {attributes.map(a=>(
                  <button key={a.id} type="button" onClick={()=>setAttribute(a.id)} className={`p-3 rounded-xl border text-center transition ${attribute===a.id ? 'bg-white text-obsidian-900 border-white shadow-lg scale-[1.02]' : 'bg-obsidian-900 border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'}`}>
                    <div className="text-xl leading-none">{a.icon}</div>
                    <div className={`text-xs font-bold mt-1 ${attribute===a.id ? 'text-obsidian-900' : 'text-white'}`}>{a.label}</div>
                    <div className="text-[10px] font-mono opacity-70">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block">Difficulty</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {difficulties.map(d=>(
                  <button key={d.id} type="button" onClick={()=>setDifficulty(d.id)} className={`p-3 rounded-xl border text-left transition ${difficulty===d.id ? 'bg-gradient-to-br from-ember-500 to-amber-500 border-ember-500 text-obsidian-900 shadow' : 'bg-obsidian-900 border-white/10 hover:border-white/20'}`}>
                    <div className={`text-xs font-black tracking-widest ${difficulty===d.id ? 'text-obsidian-900' : 'text-white'}`}>{d.label.toUpperCase()}</div>
                    <div className={`text-xs font-mono mt-1 ${difficulty===d.id ? 'text-obsidian-800' : 'text-zinc-500'}`}>+{d.xp} XP • +{d.gold} G</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-4 sm:p-5 bg-obsidian-800 border-t border-white/5 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-ember-500 to-amber-500 hover:from-ember-600 hover:to-amber-600 text-obsidian-900 font-bold text-sm shadow-lg">
              {initial ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
}
