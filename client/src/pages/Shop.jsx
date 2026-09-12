import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ShoppingBag, Check } from 'lucide-react';

const rarityStyle = {
  common: 'rarity-common',
  rare: 'rarity-rare',
  epic: 'rarity-epic',
  legendary: 'rarity-legendary',
};

export default function Shop() {
  const [items, setItems] = useState([]);
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [buying, setBuying] = useState(null);

  const load = async () => {
    const [shop, char] = await Promise.all([api.getShop(), api.getCharacter()]);
    setItems(shop.items); setCharacter(char.character); setLoading(false);
  };
  useEffect(()=>{ load(); }, []);

  const buy = async (id) => {
    setBuying(id);
    try {
      const res = await api.buyItem(id);
      setCharacter(res.character);
      setItems(it=> it.map(x=> x.id===id ? {...x, owned:true} : x));
      setToast({ msg: `Bought ${res.item.name}!`, type:'success' });
      setTimeout(()=>setToast(null), 2500);
    } catch(e){ setToast({msg:e.message, type:'error'}); setTimeout(()=>setToast(null), 2500); }
    finally { setBuying(null); }
  };

  if (loading) return <div className="h-64 rounded-2xl bg-obsidian-800 animate-pulse" />;

  const categories = ['all','relic','badge','theme','consumable','companion'];
  const filtered = filter==='all' ? items : items.filter(i=>i.category===filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
        <div>
          <h1 className="font-semibold text-2xl flex items-center gap-2"><ShoppingBag className="w-6 h-6 text-ember-400" /> Shop</h1>
          <p className="text-sm text-zinc-500">Spend your gold on items. Purchases are saved to your account.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-obsidian-900 font-black flex items-center gap-2 shadow-lg"><Coins className="w-4 h-4" /> {character.gold} GOLD</div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-500">{items.filter(i=>i.owned).length}/{items.length} owned</div>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {categories.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap ${filter===c ? 'bg-white text-obsidian-900 border-white' : 'bg-obsidian-800 border-white/10 text-zinc-400'}`}>{c[0].toUpperCase()+c.slice(1)}</button>
        ))}
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item=>(
          <motion.div key={item.id} whileHover={{ y:-4 }} className={`relative rounded-[20px] border bg-obsidian-800/70 backdrop-blur p-5 flex flex-col ${rarityStyle[item.rarity]} ${item.owned ? 'opacity-90' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-obsidian-900 border border-white/10 flex items-center justify-center text-2xl">{item.icon}</div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${item.rarity==='legendary' ? 'bg-amber-500 text-white border-amber-600' : item.rarity==='epic' ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : item.rarity==='rare' ? 'bg-blue-500/15 text-blue-300 border-blue-500/20' : 'bg-white/5 text-zinc-400 border-white/10'}`}>{item.rarity.toUpperCase()}</span>
            </div>
            <h3 className="font-bold mt-3">{item.name}</h3>
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2 flex-1">{item.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center gap-1"><Coins className="w-3.5 h-3.5" /> {item.price}</span>
              {item.owned ? (
                <span className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Owned</span>
              ) : (
                <motion.button whileTap={{scale:0.97}} disabled={buying===item.id || character.gold < item.price} onClick={()=>buy(item.id)} className="px-5 py-2 rounded-full bg-white text-obsidian-900 font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 flex items-center gap-1">
                  {buying===item.id ? <span className="w-4 h-4 border-2 border-obsidian-900/20 border-t-obsidian-900 rounded-full animate-spin" /> : character.gold < item.price ? 'Not enough gold' : 'Buy'}
                </motion.button>
              )}
            </div>
            {item.owned && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/50 animate-pulse" />}
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-obsidian-800/50 p-4 flex items-center gap-3">
        <Coins className="w-5 h-5 text-ember-400" />
        <p className="text-sm text-zinc-400">Gold comes from completing tasks — it cannot be bought or faked.</p>
      </div>

      <AnimatePresence>
        {toast && <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-full border shadow-xl text-sm font-medium flex items-center gap-2 ${toast.type==='error' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-obsidian-900'}`}>{toast.msg}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
