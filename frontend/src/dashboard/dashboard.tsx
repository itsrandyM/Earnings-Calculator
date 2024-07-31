import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash } from "react-icons/fi";
import DeleteIncomeModal from '../components/deleteModal';

interface Income {
  _id: string;
  userId: string;
  month: string;
  currency:string;
  year: number;
  techJobEarnings: number;
  otherEarnings: number;
  totalEarnings: number;
  payableTax: number;
  earningsSubjectToIncomeSharing: number;
  amountDueToDirectEd: number;
}

const UserDashboard: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [selectedIncomeId, setSelectedIncomeId] = useState<string | null>(null);;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await apiClient.get('/api/income', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIncomes(response.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred.');
        }
        setLoading(false);
      }
    };

    const fetchEmail = () => {
      const storedEmail = localStorage.getItem('email');
      setEmail(storedEmail || 'No email found');
    };

    fetchIncomes();
    fetchEmail();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);


  const handleDeleteSuccess = (incomeId: string) => {
    setIncomes(incomes.filter(income => income._id !== incomeId));
  };

  const openDeleteModal = (incomeId: string) => {
    setSelectedIncomeId(incomeId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedIncomeId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // if (error) return <p className="text-red-500">{error}</p>;

  // Extract the first letter of the email
  const emailInitial = email ? email.charAt(0).toUpperCase() : '?';

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-28">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <div className="bg-white shadow-md p-4 mb-6 w-full max-w-lg flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <Link to={'/user-profile'}
            state={{ userId: incomes[0]?.userId }}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-lg">
              {emailInitial}
            </Link>
            <p className="text-lg font-medium text-gray-700">{email}</p>
          </div>
        </div>
        <div className="w-full  bg-white shadow-md  p-6">
          {incomes.length > 0 ? (
            <div  className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomes.map((income) => (
                <div
                  key={income._id}
                  className="bg-gray-100 p-4 border shadow-md"
                >
                  <h2 className="text-lg font-bold mb-2">{`${income.month} ${income.year}`}</h2>
                  <div className="mb-2">
                    <p>
                      <strong>Tech Job Income:</strong> {income.currency || '$'} {income.techJobEarnings}
                    </p> 
                    <p>
                      <strong>Other Income:</strong> {income.currency} {income.otherEarnings}
                    </p>
                    <p>
                      <strong>Total Income:</strong> {income.currency || '$'} {income.totalEarnings}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p>
                      <strong>Payable Tax:</strong> {income.currency || '$'} {income.payableTax}
                    </p>
                    <p>
                      <strong>Earnings Subject to Income Sharing:</strong> {income.currency || '$'} 
                      {income.earningsSubjectToIncomeSharing}
                    </p>
                    <p>
                      <strong>Amount Due to DirectEd:</strong> {income.currency || '$'} 
                      {income.amountDueToDirectEd}
                    </p>
                  </div>
                  <div className='flex justify-between'>
                  <button
            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
            onClick={() => navigate(`/income-edit/${income._id}`)}
          >
            Edit
          </button>
          <button  onClick={() => openDeleteModal(income._id)}>
            <FiTrash className='text-red-500 text-2xl'/>
          </button>
          </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-red-600 text-center'>No income data available.</p>
          )}
        </div>
      </div>
      {showDeleteModal && selectedIncomeId && (
        <DeleteIncomeModal
          incomeId={selectedIncomeId}
          onClose={closeDeleteModal}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default UserDashboard;
