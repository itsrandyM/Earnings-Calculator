import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/adminNav';

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
  userId: string;
  originalData: Income;
  updatedData: Income;
  context: string;
  status: string;
}

// interface User {
//          _id: string;
//         firstName:string
//         middleName:string,
//         lastName: string,
//         email: string,
//         countryOfResidence:string,
//         cohortYear: number,
//       }

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
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-28">
        <Navbar />
        <div>
      <h1 className="text-2xl font-bold mb-4"></h1>
      {requests.length > 0 ? (
        <div className="w-full max-w-4xl">
          {requests.map((request) => (
            <div key={request._id} className="bg-white shadow-md p-4 mb-6 rounded-lg">
                <div className='flex justify-between'>
              <h2 className="text-lg font-bold mb-2">Income Update Request: {request.userId.firstName} {request.userId.lastName}</h2>
              <h3>{request.status}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold">Original Income Data</h3>
                  <p><strong>Month:</strong> {request.originalData.month}</p>
                  <p><strong>Year:</strong> {request.originalData.year}</p>
                  <p><strong>Tech Job Income:</strong> {request.originalData.currency} {request.originalData.techJobEarnings}</p>
                  <p><strong>Other Income:</strong> {request.originalData.currency} {request.originalData.otherEarnings}</p>
                  <p><strong>Total Income:</strong> {request.originalData.currency} {request.originalData.totalEarnings}</p>
                  <p><strong>Payable Tax:</strong> {request.originalData.currency} {request.originalData.payableTax}</p>
                  <p><strong>Earnings Subject to Income Sharing:</strong> {request.originalData.currency} {request.originalData.earningsSubjectToIncomeSharing}</p>
                  <p><strong>Amount Due to DirectEd:</strong> {request.originalData.currency} {request.originalData.amountDueToDirectEd}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold">Updated Income Data</h3>
                  <p><strong>Month:</strong> {request.updatedData.month}</p>
                  <p><strong>Year:</strong> {request.updatedData.year}</p>
                  <p><strong>Tech Job Income:</strong> {request.updatedData.currency} {request.updatedData.techJobEarnings}</p>
                  <p><strong>Other Income:</strong> {request.updatedData.currency} {request.updatedData.otherEarnings}</p>
                  <p><strong>Total Income:</strong> {request.updatedData.currency} {request.updatedData.totalEarnings}</p>
                  <p><strong>Payable Tax:</strong> {request.updatedData.currency} {request.updatedData.payableTax}</p>
                  <p><strong>Earnings Subject to Income Sharing:</strong> {request.updatedData.currency} {request.updatedData.earningsSubjectToIncomeSharing}</p>
                  <p><strong>Amount Due to DirectEd:</strong> {request.updatedData.currency} {request.updatedData.amountDueToDirectEd}</p>
                </div>
              </div>
              <p className="mt-2"><strong>Context:</strong> {request.context}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleProcessRequest(request._id, 'approve')}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleProcessRequest(request._id, 'reject')}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='font-bold text-lg align-middle'>No pending update requests!</p>
      )}
      </div>
    </div>
  );
};

export default AdminUpdateRequest;
