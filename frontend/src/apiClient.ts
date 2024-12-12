import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const apiClient = axios.create({
  baseURL: 'https://earnings-calculator.onrender.com', 
  withCredentials: true
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); 
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; 
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response) {
          const { data } = error.response;
          const message = data.message || '';

          if (message === 'Token has expired. Please log in again.') {
            // Handle expired token
            localStorage.removeItem('email');
            alert('Token has expired. Please log in again.');
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return children;
};


export default apiClient;
export { AxiosInterceptor }
