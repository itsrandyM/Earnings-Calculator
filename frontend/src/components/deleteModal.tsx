import React, { useState } from 'react';
import apiClient from '../apiClient';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import icons for show/hide functionality
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteIncomeModalProps {
  incomeId: string;
  onClose: () => void;
  onDeleteSuccess: (incomeId: string) => void;
}

const DeleteIncomeModal: React.FC<DeleteIncomeModalProps> = ({ incomeId, onClose, onDeleteSuccess }) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      await apiClient.delete(`/api/income/${incomeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          password, // Pass the password in the request body
        },
      });
  
      setSuccess('Income deleted successfully!');
      setTimeout(() => {
        onDeleteSuccess(incomeId);
        onClose(); // Close modal on successful deletion
      }, 2000); // Delay closing modal to show success message
    } catch (error) {
      setError('Failed to delete income. Please check your password and try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <p className="text-xl font-bold mb-4">Confirm Delete:</p>
        <FaExclamationTriangle className='text-red-500 text-center text-5xl mx-auto'/>
        {success ? (
          <p className="text-green-500 mt-2 text-center">{success}</p>
        ) : (
          <>
            <p>Enter your password to confirm deletion:</p>
            <div className="relative mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                className="p-2 border border-gray-300 rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400" />
                ) : (
                  <FiEye className="text-gray-400" />
                )}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="flex justify-end mt-4">
              <button
                className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteIncomeModal;
