import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import LogoutButton from '../buttons/logout';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Admin Panel</h1>
        <div className="space-x-4">
          <Link to="/dashboard" className="text-white">Dashboard</Link>
          <Link to="/companies" className="text-white">Companies</Link>
          <Link to="/income-entry" className="text-white">Income Entry</Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
