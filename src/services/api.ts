import axios from 'axios';

// ─── Axios Instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'locallink_token';

// ─── Request Interceptor — Inject JWT ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Handle 401 globally ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('locallink_auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    // Bubble up the error so individual callers can show specific messages
    return Promise.reject(error);
  }
);

export default api;
export { TOKEN_KEY };
