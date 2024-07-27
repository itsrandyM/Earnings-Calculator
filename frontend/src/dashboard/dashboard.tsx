import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../apiClient';

// const UserDashboard: React.FC = () => {
//   const [incomes, setIncomes] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || '';
//   };

//   useEffect(() => {
//     const fetchIncomes = async () => {
//       try {
//         const token = getAuthToken();
//         const response = await apiClient.get('/api/income', {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         setIncomes(response.data);
//       } catch (err) {
//         setError('Failed to fetch income data.');
//       }
//     };

//     fetchIncomes();
//   }, []);

interface Income {
  _id: string;
  userId: string;
  month: string;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        
        const response = await apiClient.get('/api/income', {
          headers: {
            'Authorization': `Bearer ${token}`,
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

    fetchIncomes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
    <Navbar />
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        {incomes.length > 0 ? (
          <div className="space-y-4">
            {incomes.map((income) => (
              <div key={income._id} className="bg-gray-100 p-4 border rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-2">{`${income.month} ${income.year}`}</h2>
                <div className="mb-2">
                  <p><strong>Tech Job Income:</strong> ${income.techJobEarnings}</p>
                  <p><strong>Other Income:</strong> ${income.otherEarnings}</p>
                  <p><strong>Total Income:</strong> ${income.totalEarnings}</p>
                </div>
                <div className="mb-2">
                  <p><strong>Payable Tax:</strong> ${income.payableTax}</p>
                  <p><strong>Earnings Subject to Income Sharing:</strong> ${income.earningsSubjectToIncomeSharing}</p>
                  <p><strong>Amount Due to DirectEd:</strong> ${income.amountDueToDirectEd}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No income data available.</p>
        )}
      </div>
    </div>
  </div>
  );
};

export default UserDashboard;





// import React from 'react';
// import Navbar from '../components/Navbar';

// const UserDashboard: React.FC = () => {


//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
//         <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
//         <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
//           <div className="mb-4">
//             <h2 className="text-xl font-bold">Income Details</h2>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Tech Job Income</label>
//             <input
//               type="number"
//               value={techJob}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Other Income</label>
//             <input
//               type="number"
//               value={otherIncome}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Total Income</label>
//             <input
//               type="number"
//               value={totalIncome}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Payable Tax</label>
//             <input
//               type="number"
//               value={payableTax}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Earnings Subject to Income Sharing</label>
//             <input
//               type="number"
//               value={earningsSubjectToIncomeSharing}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Amount Due to DirectEd</label>
//             <input
//               type="number"
//               value={amountDueToDirectEd}
//               readOnly
//               className="w-full p-2 border rounded bg-gray-100"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
