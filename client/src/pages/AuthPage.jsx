import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Sword, Eye, EyeOff, Sparkles, Shield, Zap } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | signup
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password || (mode==='signup' && !username)) { setErr('All fields are required'); return; }
    setLoading(true);
    try {
      if (mode==='login') await login(email, password);
      else await signup(username, email, password);
      nav('/');
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Brand */}
      <div className="lg:w-[54%] relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-obsidian-800 via-obsidian-900 to-black border-b lg:border-b-0 lg:border-r border-white/5">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage:"url('https://grainy-gradients.vercel.app/noise.svg')"}} />
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-ember-500/20 to-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-500/10 to-emerald-600/10 blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE • SEASON OF ASCENSION
          </div>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ember-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Sword className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl tracking-wide">LIFE RPG</h1>
              <p className="text-xs font-mono tracking-[0.2em] text-rune-gold">FORGE YOUR LEGEND</p>
            </div>
          </div>

          <div className="mt-10 max-w-[560px]">
            <motion.h2 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="font-display font-black text-4xl sm:text-5xl leading-[0.9] tracking-tight">
              Your life,<br />
              <span className="bg-gradient-to-r from-ember-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">but legendary.</span>
            </motion.h2>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-4 max-w-[520px]">
              Turn mundane tasks into epic quests. Gain XP, level attributes, keep streaks, and spend gold in the Armory. The delayed gratification trap ends here.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <Feature icon={Zap} title="Instant XP" desc="Every check gives dopamine" />
              <Feature icon={Shield} title="Anti-cheat" desc="Server-secured progress" />
              <Feature icon={Sparkles} title="Tactile joy" desc="Animations & particles" />
            </div>
          </div>
        </div>

        <div className="relative mt-10 hidden lg:block">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-4 flex items-center gap-4">
            <img src="https://i.pravatar.cc/100?img=11" alt="" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <p className="text-sm text-zinc-300">“I finally look forward to studying. Level 12 and my streak is 21 days. This is magic.”</p>
              <p className="text-xs font-mono text-zinc-500 mt-1">— Aelia, Level 12 Scholar • 21-day streak</p>
            </div>
          </div>
          <p className="text-[11px] font-mono tracking-widest text-zinc-600 mt-3">© 2026 LIFE RPG • MADE FOR DREAMERS WHO SHIP</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-obsidian-900">
        <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} className="w-full max-w-[420px]">
          <div className="rounded-[24px] border border-white/10 bg-obsidian-800/80 backdrop-blur shadow-2xl overflow-hidden">
            <div className="p-1 flex gap-1 bg-obsidian-900 rounded-t-[24px]">
              <button onClick={()=>setMode('login')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${mode==='login' ? 'bg-white text-obsidian-900 shadow' : 'text-zinc-400 hover:text-white'}`}>Log In</button>
              <button onClick={()=>setMode('signup')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${mode==='signup' ? 'bg-white text-obsidian-900 shadow' : 'text-zinc-400 hover:text-white'}`}>Create Account</button>
            </div>

            <form onSubmit={submit} className="p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="font-display font-bold text-xl">{mode==='login' ? 'Welcome back, hero.' : 'Begin your ascent.'}</h3>
                <p className="text-sm text-zinc-500">Your progress is saved securely and syncs across devices.</p>
              </div>

              {err && <div role="alert" className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{err}</div>}

              {mode==='signup' && (
                <div>
                  <label className="text-xs font-mono tracking-widest text-zinc-500 mb-1.5 block">HERO NAME</label>
                  <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Aria Stormblade" className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/10 focus:border-ember-500/40 focus:ring-2 focus:ring-ember-500/20 outline-none text-sm" />
                </div>
              )}

              <div>
                <label className="text-xs font-mono tracking-widest text-zinc-500 mb-1.5 block">EMAIL</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="hero@realm.io" className="w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/10 focus:border-ember-500/40 focus:ring-2 focus:ring-ember-500/20 outline-none text-sm" />
              </div>

              <div>
                <label className="text-xs font-mono tracking-widest text-zinc-500 mb-1.5 block">PASSWORD</label>
                <div className="relative">
                  <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-12 rounded-xl bg-obsidian-900 border border-white/10 focus:border-ember-500/40 focus:ring-2 focus:ring-ember-500/20 outline-none text-sm" />
                  <button type="button" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode==='signup' && <p className="text-xs text-zinc-600 mt-1 font-mono">Min 6 characters. Steal-proof (bcrypt + JWT).</p>}
              </div>

              <motion.button whileTap={{scale:0.98}} disabled={loading} type="submit" className="w-full py-3.5 rounded-full bg-gradient-to-r from-ember-500 to-amber-500 hover:from-ember-600 hover:to-amber-600 text-obsidian-900 font-black shadow-lg shadow-ember-500/20 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <span className="w-5 h-5 border-2 border-obsidian-900/30 border-t-obsidian-900 rounded-full animate-spin" /> : mode==='login' ? 'Enter the Realm →' : 'Forge My Legend →'}
              </motion.button>

              <p className="text-center text-xs text-zinc-500 font-mono">
                {mode==='login' ? "No account? " : "Already ascended? "}
                <button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')} className="text-ember-400 hover:text-ember-300 underline underline-offset-2">
                  {mode==='login' ? "Create one" : "Log in"}
                </button>
              </p>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-600">
                <span>SECURE • ENCRYPTED</span><span>↻ SYNCED</span><span>⌘ ACCESSIBLE</span>
              </div>
            </form>
          </div>
          <p className="text-center text-xs text-zinc-600 font-mono mt-4">By continuing you agree to chase greatness.</p>
        </motion.div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/5 p-3 flex gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-ember-400" /></div>
      <div><div className="text-sm font-bold">{title}</div><div className="text-xs text-zinc-500">{desc}</div></div>
    </div>
  );
}
