import React from 'react';
import Navbar from '../components/Navbar';
import { useIncome } from '../middleware.tsx/Income';

const UserDashboard: React.FC = () => {
  const { incomeData } = useIncome();

  const totalIncome = incomeData.techJob + incomeData.otherIncome;
  const payableTax = totalIncome * 0.1; // Example tax calculation
  const earningsSubjectToIncomeSharing = totalIncome;
  const amountDueToDirectEd = earningsSubjectToIncomeSharing * 0.2;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Income Details</h2>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tech Job Income</label>
            <input
              type="number"
              value={incomeData.techJob}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Other Income</label>
            <input
              type="number"
              value={incomeData.otherIncome}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
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
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
