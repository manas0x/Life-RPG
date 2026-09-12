const BASE = '';

function getToken() {
  return localStorage.getItem('life_rpg_token');
}

async function request(path, { method='GET', body, auth=true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(()=>({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method:'POST', body: payload, auth:false }),
  login: (payload) => request('/auth/login', { method:'POST', body: payload, auth:false }),
  me: () => request('/auth/me'),
  getTasks: () => request('/tasks'),
  createTask: (payload) => request('/tasks', { method:'POST', body: payload }),
  updateTask: (id, payload) => request(`/tasks/${id}`, { method:'PUT', body: payload }),
  deleteTask: (id) => request(`/tasks/${id}`, { method:'DELETE' }),
  completeTask: (id) => request(`/tasks/${id}/complete`, { method:'POST' }),
  getCharacter: () => request('/character'),
  getShop: () => request('/shop'),
  buyItem: (id) => request(`/shop/buy/${id}`, { method:'POST' }),
  getHistory: () => request('/history'),
  health: () => request('/health', { auth:false }),
};
