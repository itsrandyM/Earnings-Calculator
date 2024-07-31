import React, { useState } from 'react';
import apiClient from '../apiClient'; // Import your apiClient
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface MonthlyData {
  techJob: number;
  otherIncome: number;
}

const IncomeEntry: React.FC = () => {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState('KES');
  const [year, setYear] = useState('');
  const [halfYear, setHalfYear] = useState('');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(Array(6).fill({ techJob: 0, otherIncome: 0 }));
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const calculateKenyanPayableTax = (monthlyIncome: number) => {
    let tax = 0;
    let remainingIncome = monthlyIncome;

    // Tax bands (monthly amounts)
    const bands = [
      { limit: 24000, rate: 0.10 },
      { limit: 8333, rate: 0.25 },
      { limit: 467667, rate: 0.30 },
      { limit: 300000, rate: 0.325 },
      { limit: Infinity, rate: 0.35 },
    ];

    // Iterate through each tax band
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

    // Ethiopian tax bands (monthly amounts)
    const bands = [
      { limit: 600, rate: 0.00 },  // No tax up to 600 ETB
      { limit: 165, rate: 0.10 },  // 10% tax on income above 600 ETB up to 765 ETB
      { limit: 120, rate: 0.15 },  // 15% tax on income above 765 ETB up to 885 ETB
      { limit: 135, rate: 0.20 },  // 20% tax on income above 885 ETB up to 1020 ETB
      { limit: 500, rate: 0.25 },  // 25% tax on income above 1020 ETB up to 1520 ETB
      { limit: 1000, rate: 0.30 }, // 30% tax on income above 1520 ETB up to 2520 ETB
      { limit: Infinity, rate: 0.35 }, // 35% tax on income above 2520 ETB
    ];

    // Iterate through each tax band
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

  const calculateForMonth = (techJob: number) => {
    const totalIncome = techJob;
    const payableTax =
      currency === 'KES'
        ? calculateKenyanPayableTax(techJob)
        : calculateEthiopianPayableTax(techJob);
    const earningsSubjectToIncomeSharing = techJob - payableTax;
    const amountDueToDirectEd = earningsSubjectToIncomeSharing * 0.2;

    return { totalIncome, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd };
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i);

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  const handleMonthlyDataChange = (index: number, field: keyof MonthlyData, value: number) => {
    const newData = [...monthlyData];
    newData[index] = { ...newData[index], [field]: value };
    setMonthlyData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = getAuthToken();
      const incomeData = monthlyData.map(({ techJob, otherIncome }, index) => {
        const { totalIncome, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd } = calculateForMonth(techJob);
        return {
          month: monthNames[(parseInt(halfYear) - 1) * 6 + index],
          year,
          currency,
          techJobEarnings: techJob,
          otherEarnings: otherIncome,
          totalEarnings: totalIncome + otherIncome,
          payableTax,
          earningsSubjectToIncomeSharing,
          amountDueToDirectEd
        };
      });

      // Make the API request with the Authorization header
      const response = await apiClient.post(
        '/api/income',
        { incomeData },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      console.log(response);
      setSuccessMessage('Income entry saved successfully.');
      setError(null);
      navigate('/dash-user');
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
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-28">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Enter Monthly Earnings</h1>
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between space-x-4">
              <div className="w-1/3">
                <label className="block text-gray-700 mb-2">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <div className="w-2/3">
                <label className="block text-gray-700 mb-2">Half Year</label>
                <select
                  value={halfYear}
                  onChange={(e) => setHalfYear(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Half</option>
                  <option value="1">H1 (January - June)</option>
                  <option value="2">H2 (July - December)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="ETB">Ethiopian Birr (ETB)</option>
              </select>
            </div>
            {halfYear && (
              <div className="space-y-6">
                {monthlyData.map((data, index) => {
                  const { totalIncome, payableTax, earningsSubjectToIncomeSharing, amountDueToDirectEd } = calculateForMonth(data.techJob);
                  return (
                    <div key={index} className="border-t pt-4">
                      <h3 className="text-lg font-semibold">{monthNames[(parseInt(halfYear) - 1) * 6 + index]}</h3>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-gray-700 mb-2">Tech Job Income</label>
                          <input
                            type="number"
                            value={data.techJob}
                            onChange={(e) => handleMonthlyDataChange(index, 'techJob', Number(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-gray-700 mb-2">Other Income</label>
                          <input
                            type="number"
                            value={data.otherIncome}
                            onChange={(e) => handleMonthlyDataChange(index, 'otherIncome', Number(e.target.value))}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2">Total Income</label>
                            <input
                              type="number"
                              value={totalIncome + data.otherIncome}
                              readOnly
                              className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2">Payable Tax</label>
                            <input
                              type="number"
                              value={payableTax}
                              readOnly
                              className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2">Earnings Subject to Income Sharing</label>
                            <input
                              type="number"
                              value={earningsSubjectToIncomeSharing}
                              readOnly
                              className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2">Amount Due to DirectEd</label>
                            <input
                              type="number"
                              value={amountDueToDirectEd}
                              readOnly
                              className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-lg w-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
