import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/adminNav';
import { MdOutlinePending } from "react-icons/md";
import ErrorPage from '../Errors/errorPage';

interface Income {
  _id: string;
  month: string;
  year: number;
  currency: string;
  techJobEarnings: number;
  otherEarnings: number;
  totalEarnings: number;
  payableTax: number;
  earningsSubjectToIncomeSharing: number;
  amountDueToDirectEd: number;
}

interface UpdateRequest {
  _id: string;
  incomeId: Income;
  userId: User;
  originalData: Income;
  updatedData: Income;
  context: string;
  status: string;
}

interface User {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  countryOfResidence: string;
  cohortYear: number;
}

const AdminUpdateRequest: React.FC = () => {
  const [requests, setRequests] = useState<UpdateRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await apiClient.get('/api/update-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(response.data);
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

    fetchRequests();
  }, []);

  const handleProcessRequest = async (requestId: string, action: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await apiClient.post(`/api/update-request/${requestId}`, { action }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      setRequests(requests.filter((req) => req._id !== requestId));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return < ErrorPage />;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-6 pt-28">
      <Navbar />
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Update Requests</h1>
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="bg-white shadow-sm rounded-lg p-6 mb-6 ">
              <div className='flex justify-between items-center mb-4'>
                <h2 className="text-lg font-semibold text-gray-800">
                  Income Update Request: {request.userId.firstName} {request.userId.lastName}
                </h2>
                <div className='flex items-center p-1 bg-gray-100 rounded'>
                  <MdOutlinePending className='text-xl text-gray-600 mr-2' />
                  <span className='text-sm font-medium text-gray-600'>{request.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="bg-white p-3 rounded-lg shadow-sm ">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Original Income Data</h3>
                  <p><strong>Month:</strong> {request.originalData.month}</p>
                  <p><strong>Year:</strong> {request.originalData.year}</p>
                  <p><strong>Tech Job Income:</strong> {request.originalData.currency} {request.originalData.techJobEarnings.toFixed(2)}</p>
                  <p><strong>Other Income:</strong> {request.originalData.currency} {request.originalData.otherEarnings.toFixed(2)}</p>
                  <p><strong>Total Income:</strong> {request.originalData.currency} {request.originalData.totalEarnings.toFixed(2)}</p>
                  <p><strong>Payable Tax:</strong> {request.originalData.currency} {request.originalData.payableTax.toFixed(2)}</p>
                  <p><strong>Earnings Subject to Income Sharing:</strong> {request.originalData.currency} {request.originalData.earningsSubjectToIncomeSharing.toFixed(2)}</p>
                  <p><strong>Amount Due to DirectEd:</strong> {request.originalData.currency} {request.originalData.amountDueToDirectEd.toFixed(2)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Updated Income Data</h3>
                  <p><strong>Month:</strong> {request.updatedData.month}</p>
                  <p><strong>Year:</strong> {request.updatedData.year}</p>
                  <p><strong>Tech Job Income:</strong> {request.updatedData.currency} {request.updatedData.techJobEarnings.toFixed(2)}</p>
                  <p><strong>Other Income:</strong> {request.updatedData.currency} {request.updatedData.otherEarnings.toFixed(2)}</p>
                  <p><strong>Total Income:</strong> {request.updatedData.currency} {request.updatedData.totalEarnings.toFixed(2)}</p>
                  <p><strong>Payable Tax:</strong> {request.updatedData.currency} {request.updatedData.payableTax.toFixed(2)}</p>
                  <p><strong>Earnings Subject to Income Sharing:</strong> {request.updatedData.currency} {request.updatedData.earningsSubjectToIncomeSharing.toFixed(2)}</p>
                  <p><strong>Amount Due to DirectEd:</strong> {request.updatedData.currency} {request.updatedData.amountDueToDirectEd.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4"><strong>Context:</strong> {request.context}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleProcessRequest(request._id, 'approve')}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleProcessRequest(request._id, 'reject')}
                  className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='font-bold text-lg text-center text-gray-700'>No pending update requests!</p>
        )}
      </div>
    </div>
  );
};

export default AdminUpdateRequest;
