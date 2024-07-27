import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000', 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
