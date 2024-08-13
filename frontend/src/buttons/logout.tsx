import React, { useState } from 'react';
import { logout } from '../Forms/authService'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true); // Set loading to true when starting logout

    try {
      await logout();
      // Optionally, clear any relevant data or handle post-logout logic
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('email');
      navigate('/login'); // Redirect to login or home page
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, handle error state or show an error message
    } finally {
      setIsLoading(false); // Set loading to false after logout is complete
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
