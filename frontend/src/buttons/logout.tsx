import React from 'react';
import { logout } from '../Forms/authService'; // Ensure the path is correct

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-blue-500 text-white p-2 rounded shadow-sm"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
