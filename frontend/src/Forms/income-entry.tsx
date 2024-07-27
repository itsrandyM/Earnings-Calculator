import React, { useState } from 'react';
import apiClient from '../apiClient'; // Import your apiClient
import Navbar from '../components/Navbar';

const IncomeEntry: React.FC = () => {
  const [currency, setCurrency] = useState('KES');
  const [techJob, setTechJob] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalIncome = techJob + otherIncome;
  const payableTax = totalIncome * 0.1; // Example tax calculation
  const earningsSubjectToIncomeSharing = totalIncome;
  const amountDueToDirectEd = earningsSubjectToIncomeSharing * 0.2;
 
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'   

  ];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i);

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  }


  const handleCurrencyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setCurrency(event.target.value);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = getAuthToken();

      // Make the API request with the Authorization header
      const response = await apiClient.post(
        '/api/income',
        {
          month,
          year,
          techJobEarnings: techJob,
          otherEarnings: otherIncome,
          totalEarnings: totalIncome,
          payableTax,
          earningsSubjectToIncomeSharing,
          amountDueToDirectEd
        },
        {
          headers: {
            'Authorization': `Bearer ${token}` 
          }
        });
      console.log(response)
      setSuccessMessage('Income entry saved successfully.');
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Income Entry</h1>
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className='flex flex-row'>
      <div className="mb-4">
        <label className="block text-gray-700">Month</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-3/4 p-2 border rounded"
          required
        >
          <option value="">Month</option>
          {monthNames.map((month, index) => (
            <option key={index} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Year</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div>
      <select value={currency} onChange={handleCurrencyChange}>
        <option value="KES">Kenyan Shilling (KES)</option>
        <option value="ETB">Ethiopian Birr (ETB)</option>
      </select>
      </div>
            <div className="mb-4">
              <label className="block text-gray-700">Tech Job Income</label>
              <input
                type="currency"
                value={techJob}
                onChange={(e) => setTechJob(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
              
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Other Income</label>
              <input
                type="number"
                value={otherIncome}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total Income</label>
              <input
                type="number"
                value={totalIncome}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Payable Tax</label>
              <input
                type="number"
                value={payableTax}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Earnings Subject to Income Sharing</label>
              <input
                type="number"
                value={earningsSubjectToIncomeSharing}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Amount Due to DirectEd</label>
              <input
                type="number"
                value={amountDueToDirectEd}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Submit
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncomeEntry;
