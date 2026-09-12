import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import CharacterPanel from '../components/CharacterPanel.jsx';
import QuestCard from '../components/QuestCard.jsx';
import QuestForm from '../components/QuestForm.jsx';
import LevelUpModal from '../components/LevelUpModal.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, ListChecks } from 'lucide-react';

export default function Dashboard() {
  const [character, setCharacter] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all'); // all | pending | done
  const [attrFilter, setAttrFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [completingId, setCompletingId] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [toast, setToast] = useState(null);

  const load = async () => {
    try {
      const [c, t] = await Promise.all([api.getCharacter(), api.getTasks()]);
      setCharacter(c.character);
      setTasks(t.tasks);
    } catch (e) {
      showToast(e.message, 'error');
    } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, []);

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(()=>setToast(null), 2800); };

  const handleCreate = async (payload) => {
    try {
      if (editing) {
        const res = await api.updateTask(editing.id, payload);
        setTasks(ts=> ts.map(x=> x.id===editing.id ? res.task : x));
        showToast('Task updated');
      } else {
        const res = await api.createTask(payload);
        setTasks(ts=> [res.task, ...ts]);
        showToast('Task added!');
      }
      setFormOpen(false); setEditing(null);
    } catch(e){ showToast(e.message,'error'); }
  };

  const handleComplete = async (task) => {
    setCompletingId(task.id);
    try {
      const res = await api.completeTask(task.id);
      setTasks(ts=> ts.map(x=> x.id===task.id ? res.task : x));
      setCharacter(res.character);
      if (res.leveledUp) setLevelUp({ level: res.character.level, rewards: res.rewards });
      else showToast(`+${res.rewards.xp} XP · +${res.rewards.gold} gold`);
    } catch(e){ showToast(e.message,'error'); }
    finally { setCompletingId(null); }
  };

  const handleDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try { await api.deleteTask(task.id); setTasks(ts=>ts.filter(x=>x.id!==task.id)); showToast('Task deleted'); }
    catch(e){ showToast(e.message,'error'); }
  };

  const filtered = tasks.filter(t=>{
    if (filter==='pending' && t.completed) return false;
    if (filter==='done' && !t.completed) return false;
    if (attrFilter!=='all' && t.attribute!==attrFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const pendingCount = tasks.filter(t=>!t.completed).length;
  const doneCount = tasks.filter(t=>t.completed).length;

  if (loading) return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      <div className="h-[500px] rounded-[20px] bg-obsidian-800 animate-pulse" />
      <div className="space-y-3">
        <div className="h-12 rounded-2xl bg-obsidian-800 animate-pulse" />
        <div className="h-32 rounded-2xl bg-obsidian-800 animate-pulse" />
        <div className="h-32 rounded-2xl bg-obsidian-800 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
      <div className="lg:sticky lg:top-[80px] space-y-4">
        <CharacterPanel character={character} />
      </div>

      <div className="min-w-0">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div>
            <h1 className="font-semibold text-2xl flex items-center gap-2">
              <ListChecks className="w-6 h-6 text-ember-400" /> Tasks
              <span className="ml-2 px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 text-xs font-medium">{pendingCount} active</span>
            </h1>
            <p className="text-sm text-zinc-500">Complete tasks to earn XP and gold. Each level costs more XP than the last.</p>
          </div>
          <motion.button whileTap={{scale:0.98}} onClick={()=>{ setEditing(null); setFormOpen(true); }} className="px-5 py-3 rounded-full bg-white text-obsidian-900 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-zinc-100">
            <Plus className="w-4 h-4" /> New Task
          </motion.button>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              {id:'all', label:`All (${tasks.length})`},
              {id:'pending', label:`Active (${pendingCount})`},
              {id:'done', label:`Done (${doneCount})`},
            ].map(f=>(
              <button key={f.id} onClick={()=>setFilter(f.id)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${filter===f.id ? 'bg-white text-obsidian-900 border-white' : 'bg-obsidian-800 border-white/10 text-zinc-400 hover:text-white'}`}>{f.label}</button>
            ))}
            <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." className="w-full pl-9 pr-3 py-2 rounded-full bg-obsidian-800 border border-white/10 focus:border-ember-500/40 outline-none text-sm placeholder:text-zinc-600" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
            {['all','strength','intellect','vitality','charisma','discipline'].map(a=>(
              <button key={a} onClick={()=>setAttrFilter(a)} className={`px-3 py-1.5 rounded-full text-xs font-mono border whitespace-nowrap ${attrFilter===a ? 'bg-ember-500 text-white border-ember-500' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                {a==='all' ? 'All' : a}
              </button>
            ))}
          </div>
        </div>

        {/* Task grid */}
        <div className="mt-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
          <AnimatePresence>
            {filtered.length===0 ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="sm:col-span-2 rounded-2xl border border-dashed border-white/10 bg-obsidian-800/30 p-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 flex items-center justify-center">📜</div>
                <h3 className="font-semibold mt-3">No tasks here</h3>
                <p className="text-sm text-zinc-500 mt-1">Try a different filter, or add a new task.</p>
                <button onClick={()=>{ setEditing(null); setFormOpen(true); }} className="mt-4 px-4 py-2 rounded-full bg-white text-obsidian-900 font-bold text-sm">Add Task</button>
              </motion.div>
            ) : filtered.map(task=>(
              <QuestCard
                key={task.id}
                task={task}
                completing={completingId===task.id}
                onComplete={handleComplete}
                onEdit={(t)=>{ setEditing(t); setFormOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 rounded-2xl border border-white/5 bg-obsidian-800/50 p-4 text-sm text-zinc-400">
          Level {character?.level} · {Math.max(0, (character?.nextXp ?? 0) - (character?.xp ?? 0))} XP to the next level. Each level needs more XP than the last.
        </div>
      </div>

      <QuestForm open={formOpen} onClose={()=>{ setFormOpen(false); setEditing(null); }} onSubmit={handleCreate} initial={editing} />
      <LevelUpModal open={!!levelUp} onClose={()=>setLevelUp(null)} level={levelUp?.level} rewards={levelUp?.rewards} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:20, opacity:0 }} className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-full border shadow-xl flex items-center gap-2 text-sm font-medium ${toast.type==='error' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-obsidian-900 border-white'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
