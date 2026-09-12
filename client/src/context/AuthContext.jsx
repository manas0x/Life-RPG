import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('life_rpg_token');
    if (!token) { setLoading(false); return; }
    api.me().then(res=> setUser(res.user)).catch(()=> localStorage.removeItem('life_rpg_token')).finally(()=> setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('life_rpg_token', res.token);
    setUser(res.user);
    return res;
  };
  const signup = async (username, email, password) => {
    const res = await api.signup({ username, email, password });
    localStorage.setItem('life_rpg_token', res.token);
    setUser(res.user);
    return res;
  };
  const logout = () => {
    localStorage.removeItem('life_rpg_token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
