import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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


const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('token');
          localStorage.removeItem('email')
          
          const isAdmin = localStorage.getItem('isAdmin') === 'true';
          if (isAdmin) {
             navigate('/admin-login');
             alert('Token has expired. Please login again.');
          } else {
            navigate('/');
            alert('Token has expired. Please login again.');
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
