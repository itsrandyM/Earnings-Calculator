import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../admin/logoutAdmin';
import usePendingRequestsCount from '../hooks/usePendingRequests';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pendingCount} = usePendingRequestsCount();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-500 p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-20">
          <img
            src="/DirectEd Development Logo horizontal white.png"
            alt="Logo"
            className="h-10 w-auto hover:scale-80 cursor-pointer"
          />
          <h1 className="text-white text-xl font-bold hidden md:block cursor-pointer">
            Admin Panel
          </h1>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <div
          className={`flex-col space-y-4 md:space-y-0 md:flex md:flex-row md:space-x-10 items-center ${
            isOpen ? 'flex' : 'hidden'
          } md:flex`}
        >
          <Link to="/admin-dashboard" className="text-white">
          <span className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-white before:transform before:origin-bottom-right before:scale-x-0 before:transition-transform before:duration-500 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100">Dashboard</span>
          </Link>
          <Link to="/update-requests" className="text-white relative ">
          <span className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-[2px] before:bg-white before:transform before:origin-bottom-right before:scale-x-0 before:transition-transform before:duration-500 before:ease-in-out hover:before:origin-bottom-left hover:before:scale-x-100">Update Requests</span>
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 mt-0 -mr-6 bg-red-600 text-white rounded-full px-2 text-xs">
                {pendingCount}
              </span>
            )}
          </Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
