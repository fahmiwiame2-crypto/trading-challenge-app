import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Direct backend URL to bypass proxy issues
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for 401/403 errors (Token expired or Invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Academy API
export const getAcademyCourses = () => api.get('/api/academy/courses');
export const getCourseDetails = (id, userId) => api.get(`/api/academy/courses/${id}`, { params: { user_id: userId } });
export const updateCourseProgress = (courseId, userId, progress, completed = false) =>
  api.post(`/api/academy/courses/${courseId}/progress`, { user_id: userId, progress, completed });

// AI API
export const getAiSignal = (symbol) => api.post('/api/ai/signal', { symbol });

// Certificate API
export const generateCertificate = (courseId, userId) => api.post(`/api/academy/courses/${courseId}/certificate`, { user_id: userId });
export const getCertificate = (certNumber) => api.get(`/api/academy/certificate/${certNumber}`);

export default api;
