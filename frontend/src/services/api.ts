import axios from 'axios';

// The base URL for your backend API.
// Make sure your backend is running on port 5000.
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Axios Request Interceptor:
// This function will run before every request is sent.
// It retrieves the token from localStorage and adds it to the Authorization header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Prepend 'Bearer ' to the token, which is the standard
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;