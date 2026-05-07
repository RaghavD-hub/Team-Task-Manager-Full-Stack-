import axios from 'axios';

const apiAgent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to inject token
apiAgent.interceptors.request.use((config) => {
  const token = localStorage.getItem('site_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for global error handling
apiAgent.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    // Session expired or invalid
    localStorage.removeItem('site_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default apiAgent;
