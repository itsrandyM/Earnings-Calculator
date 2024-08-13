import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../apiClient';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
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
  link:string
}

const EditIncome: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const navigate = useNavigate();
  const [income, setIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<string>('');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await apiClient.get(`/api/income/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIncome(response.data);
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

    fetchIncome();
    fetchEmail()
  }, [id]);

  const calculateKenyanPayableTax = (monthlyIncome: number) => {
    let tax = 0;
    let remainingIncome = monthlyIncome;

    const bands = [
      { limit: 24000, rate: 0.1 },
      { limit: 8333, rate: 0.25 },
      { limit: 467667, rate: 0.3 },
      { limit: 300000, rate: 0.325 },
      { limit: Infinity, rate: 0.35 },
    ];

    for (const { limit, rate } of bands) {
      if (remainingIncome > limit) {
        tax += limit * rate;
        remainingIncome -= limit;
      } else {
        tax += remainingIncome * rate;
        break;
      }
    }

    return tax;
  };

  const calculateEthiopianPayableTax = (monthlyIncome: number) => {
    let tax = 0;
    let remainingIncome = monthlyIncome;

    const bands = [
      { limit: 600, rate: 0.0 },
      { limit: 165, rate: 0.1 },
      { limit: 120, rate: 0.15 },
      { limit: 135, rate: 0.2 },
      { limit: 500, rate: 0.25 },
      { limit: 1000, rate: 0.3 },
      { limit: Infinity, rate: 0.35 },
    ];

    for (const { limit, rate } of bands) {
      if (remainingIncome > limit) {
        tax += limit * rate;
        remainingIncome -= limit;
      } else {
        tax += remainingIncome * rate;
        break;
      }
    }

    return tax;
  };

  const calculatePayableTax = (monthlyIncome: number, currency: string) => {
    if (currency === 'KES') {
      return calculateKenyanPayableTax(monthlyIncome);
    } else if (currency === 'ETB') {
      return calculateEthiopianPayableTax(monthlyIncome);
    }
    return 0; 
  };

  const updateCalculatedFields = (updatedIncome: Income) => {
    const totalEarnings =
      updatedIncome.techJobEarnings + updatedIncome.otherEarnings;
    const payableTax = calculatePayableTax(totalEarnings, updatedIncome.currency);
    const earningsSubjectToIncomeSharing = totalEarnings - payableTax;
    const amountDueToDirectEd = earningsSubjectToIncomeSharing * 0.2; 

    return {
      ...updatedIncome,
      totalEarnings,
      payableTax,
      earningsSubjectToIncomeSharing,
      amountDueToDirectEd,
    };
  };

  const handleInputChange = (field: keyof Income, value: number) => {
    if (income) {
      const updatedIncome = { ...income, [field]: value };
      const recalculatedIncome = updateCalculatedFields(updatedIncome);
      setIncome(recalculatedIncome);
    }
  };



  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const updatedData = { ...income, context };
      const response = await apiClient.post(`/api/income/${id}/request-update`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data);
      navigate('/dash-user'); // Navigate back to the dashboard after successful request submission
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };
  

  const emailInitial = email ? email.charAt(0).toUpperCase() : '?';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return < ErrorPage />;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-28">
      <Navbar />
      <div>
      <div className="bg-white shadow-md p-4 mb-6 w-full max-w-lg flex items-center justify-center mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-lg">
              {emailInitial}
            </div>
            <p className="text-lg font-medium text-gray-700">{email}</p>
          </div>
        </div>
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Income</h1>
      {income && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
          <div className="text-center text-lg font-semibold mb-4">
            {income.month} {income.year}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tech Job Income
              </label>
              <input
                type="number"
                value={income.techJobEarnings}
                onChange={(e) =>
                  handleInputChange('techJobEarnings', Number(e.target.value))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Other Income
              </label>
              <input
                type="number"
                value={income.otherEarnings}
                onChange={(e) =>
                  handleInputChange('otherEarnings', Number(e.target.value))
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Total Income
              </label>
              <input
                type="number"
                value={income.totalEarnings}
                readOnly
                className="w-full p-2 border bg-gray-100 rounded-lg focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Payable Tax
              </label>
              <input
                type="number"
                value={income.payableTax}
                readOnly
                className="w-full p-2 border bg-gray-100 rounded-lg focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Income Sharings Earnings
              </label>
              <input
                type="number"
                value={income.earningsSubjectToIncomeSharing}
                readOnly
                className="w-full p-2 border bg-gray-100 rounded-lg focus:outline-none cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Amount Due to DirectEd
              </label>
              <input
                type="number"
                value={income.amountDueToDirectEd}
                readOnly
                className="w-full p-2 border bg-gray-100 rounded-lg focus:outline-none cursor-not-allowed"
              />
            </div>
            </div>
            <div className='text-center'>
            <div className='text-center'>
              <label className="block text-gray-700 font-medium mb-1">
                Context
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
              />
            </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Google Drive Link
              </label>
              <input
                type="text"
                value={income.link}
                className="w-full p-2 border bg-gray-100 rounded-lg focus:outline-none mt-3 cursor-not-allowed"
              />
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 mt-4 rounded-lg w-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Update
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default EditIncome;
// function setEmail(arg0: string) {
//   throw new Error('Function not implemented.');
// }

