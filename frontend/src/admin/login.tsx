// AdminLogin.tsx
import React, { useState } from 'react';
import apiClient from '../apiClient';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('/api/login/admin', {
        email,
        password,
      });

      const { token, admin } = response.data;
      localStorage.setItem('email', admin.email)
      // Store the token in localStorage
      localStorage.setItem('token', token);


      // Redirect to admin dashboard or homepage
      navigate('/admin-dashboard');
    }  catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { data: { message: string } } };
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg flex flex-col md:flex-row">
        <div className="md:w-1/3 p-6 bg-blue-500 flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold">Logo</h1>
        </div>
        <div className="md:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-4">Administrator Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full border rounded p-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full border rounded p-2"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
