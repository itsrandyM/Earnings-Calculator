import React, { useState } from 'react';
import { logout } from '../Forms/authService'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true); 

    try {
      await logout();
      localStorage.removeItem('email');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
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
