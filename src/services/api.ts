import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // This can be changed to an environment variable later
});

// Mocking some delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('locallink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Since we don't have a real backend, we'll use a local storage mock for demo purposes
// But the service layer will look like it's calling an API.
export default api;
