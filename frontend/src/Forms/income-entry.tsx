import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const IncomeEntry: React.FC = () => {
  const [techJob, setTechJob] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const totalIncome = techJob + otherIncome;
  const payableTax = totalIncome * 0.1; // Example tax calculation
  const earningsSubjectToIncomeSharing = totalIncome;
  const amountDueToDirectEd = earningsSubjectToIncomeSharing * 0.2;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Income Entry</h1>
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700">Tech Job Income</label>
            <input
              type="number"
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
        </div>
      </div>
    </div>
  );
};

export default IncomeEntry;
