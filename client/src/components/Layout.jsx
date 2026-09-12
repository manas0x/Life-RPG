import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Sword, Scroll, Store, History, LogOut, Menu, X, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';

const nav = [
  { to: '/', label: 'Quests', icon: Scroll },
  { to: '/armory', label: 'Armory', icon: Store },
  { to: '/chronicles', label: 'Chronicles', icon: History },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/auth'); };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ember-500 to-amber-600 flex items-center justify-center shadow-lg shadow-ember-500/20">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-extrabold tracking-wide text-[18px] leading-none">LIFE RPG</h1>
              <p className="text-[11px] tracking-[0.18em] text-rune-gold font-mono -mt-0.5">FORGE YOUR LEGEND</p>
            </div>
            <span className="hidden lg:inline-flex ml-3 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400">v1.0 • ASCENSION</span>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-obsidian-800 border border-white/5">
            {nav.map(item => (
              <NavLink key={item.to} to={item.to} className={({isActive})=> `px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${isActive ? 'bg-white text-obsidian-900 shadow' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-3 pl-3 pr-1 py-1 rounded-full bg-obsidian-800 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
                  {user.username[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium pr-2 max-w-[120px] truncate">{user.username}</span>
                <button onClick={handleLogout} aria-label="Log out" className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            <button onClick={()=>setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 rounded-xl bg-obsidian-800 border border-white/10 flex items-center justify-center" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
            </button>
          </div>
        </div>
        {/* mobile nav */}
        {mobileOpen && (
          <motion.div initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} className="md:hidden border-t border-white/5 bg-obsidian-800 px-4 py-3 flex gap-2">
            {nav.map(item=>(
              <NavLink key={item.to} onClick={()=>setMobileOpen(false)} to={item.to} className={({isActive})=> `flex-1 py-2.5 rounded-xl text-sm font-medium flex flex-col items-center gap-1 ${isActive ? 'bg-white text-obsidian-900' : 'bg-white/5 text-zinc-300'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </NavLink>
            ))}
            {user && <button onClick={handleLogout} className="px-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-sm">Logout</button>}
          </motion.div>
        )}
      </header>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-white/[0.04] py-4 text-center text-xs font-mono tracking-widest text-zinc-500">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5" /> LIFE RPG • PROGRESS IS SACRED • <Sparkles className="w-3.5 h-3.5" />
        </div>
      </footer>
    </div>
  );
}
