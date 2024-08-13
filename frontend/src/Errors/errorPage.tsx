import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white p-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold mb-4 animate-bounce">
          404
        </h1>
        <p className="text-2xl font-light mb-8">
          Lost in Space!
        </p>
        <div className="w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search the universe"
            className="w-full px-4 py-3 border border-transparent rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 text-gray-900"
          />
        </div>
        <div className="flex space-x-4 mb-6">
          <Link
            to="/"
            className="px-6 py-3 bg-yellow-300 text-gray-900 font-semibold rounded-full shadow-lg hover:bg-yellow-400 transition transform hover:scale-110"
          >
            Back to Earth
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-green-300 text-gray-900 font-semibold rounded-full shadow-lg hover:bg-green-400 transition transform hover:scale-110"
          >
            Contact Mission Control
          </Link>
        </div>
        <p className="text-lg text-yellow-200">
          Or explore the <Link to="/sitemap" className="underline">Galaxy Map</Link>.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
