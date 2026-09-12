import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

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
    if (!email || !password || (mode==='signup' && !username)) { setErr('Please fill in every field.'); return; }
    setLoading(true);
    try {
      if (mode==='login') await login(email, password);
      else await signup(username, email, password);
      nav('/');
    } catch (e) {
      setErr(e.message);
    } finally { setLoading(false); }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-obsidian-900 border border-white/10 focus:border-ember-500/50 focus:ring-2 focus:ring-ember-500/20 outline-none text-sm placeholder:text-zinc-600';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity:0, y:12 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3, ease:'easeOut' }}
        className="w-full max-w-[400px]"
      >
        <div className="text-center mb-7">
          <h1 className="text-2xl font-semibold tracking-tight">Life RPG</h1>
          <p className="text-sm text-zinc-500 mt-1.5">Track your tasks. Earn XP. Level up.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-obsidian-800/80 backdrop-blur shadow-xl overflow-hidden">
          <div className="p-1 flex gap-1 bg-obsidian-900">
            <button type="button" onClick={()=>setMode('login')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${mode==='login' ? 'bg-white text-obsidian-900 shadow' : 'text-zinc-400 hover:text-white'}`}>Log in</button>
            <button type="button" onClick={()=>setMode('signup')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${mode==='signup' ? 'bg-white text-obsidian-900 shadow' : 'text-zinc-400 hover:text-white'}`}>Sign up</button>
          </div>

          <form onSubmit={submit} className="p-6 space-y-4">
            {err && <div role="alert" className="px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{err}</div>}

            {mode==='signup' && (
              <div>
                <label htmlFor="username" className="text-xs font-medium text-zinc-400 mb-1.5 block">Username</label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                  placeholder="jane"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-xs font-medium text-zinc-400 mb-1.5 block">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show?'text':'password'}
                  autoComplete={mode==='login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/5">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode==='signup' && <p className="text-xs text-zinc-500 mt-1.5">At least 6 characters.</p>}
            </div>

            <motion.button
              whileTap={{ scale:0.99 }}
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-xl bg-ember-500 hover:bg-ember-600 text-white font-semibold shadow-lg shadow-ember-500/20 disabled:opacity-60 flex items-center justify-center gap-2 transition"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : mode==='login' ? 'Log in' : 'Create account'}
            </motion.button>

            <p className="text-center text-sm text-zinc-500">
              {mode==='login' ? 'Don\u2019t have an account? ' : 'Already have an account? '}
              <button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')} className="text-ember-400 hover:text-ember-300 font-medium">
                {mode==='login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
