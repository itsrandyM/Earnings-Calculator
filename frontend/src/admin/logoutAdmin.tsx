import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';

const LogoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true); 

    try {
      await apiClient.post('/api/logout/admin');
      localStorage.removeItem('email');
      window.location.href = '/admin-login'
    } catch (error) {
      console.error('Logout failed:', error);
      alert("Logout Failed!")
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-white text-blue-500 p-2 rounded shadow-sm flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isLoading}
    >
      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      )}
      Logout
    </button>
  );
};

export default LogoutButton;
