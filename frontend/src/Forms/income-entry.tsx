// import React, { useState } from 'react';
// import apiClient from '../apiClient'; // Import your apiClient
// import Navbar from '../components/Navbar';
// import { useNavigate } from 'react-router-dom';

// const IncomeEntry: React.FC = () => {
//   const navigate = useNavigate()
//   const [currency, setCurrency] = useState('KES');
//   const [techJob, setTechJob] = useState<number>(0);
//   const [otherIncome, setOtherIncome] = useState<number>(0);
//   const [month, setMonth] = useState('');
//   const [year, setYear] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const calculateKenyanPayableTax = (monthlyIncome:number) => {
//     let tax = 0;
//     let remainingIncome = monthlyIncome;

//     // Tax bands (monthly amounts)
//     const bands = [
//       { limit: 24000, rate: 0.10 },
//       { limit: 8333, rate: 0.25 },
//       { limit: 467667, rate: 0.30 },
//       { limit: 300000, rate: 0.325 },
//       { limit: Infinity, rate: 0.35 },
//     ];

//     // Iterate through each tax band
//     for (const { limit, rate } of bands) {
//       if (remainingIncome > limit) {
//         tax += limit * rate;
//         remainingIncome -= limit;
//       } else {
//         tax += remainingIncome * rate;
//         break;
//       }
//     }

//     return tax;
//   };

//   const calculateEthiopianPayableTax = (monthlyIncome: number) => {
//     let tax = 0;
//     let remainingIncome = monthlyIncome;

//     // Ethiopian tax bands (monthly amounts)
//     const bands = [
//       { limit: 600, rate: 0.00 },  // No tax up to 600 ETB
//       { limit: 165, rate: 0.10 },  // 10% tax on income above 600 ETB up to 765 ETB
//       { limit: 120, rate: 0.15 },  // 15% tax on income above 765 ETB up to 885 ETB
//       { limit: 135, rate: 0.20 },  // 20% tax on income above 885 ETB up to 1020 ETB
//       { limit: 500, rate: 0.25 },  // 25% tax on income above 1020 ETB up to 1520 ETB
//       { limit: 1000, rate: 0.30 }, // 30% tax on income above 1520 ETB up to 2520 ETB
//       { limit: Infinity, rate: 0.35 }, // 35% tax on income above 2520 ETB
//     ];

//     // Iterate through each tax band
//     for (const { limit, rate } of bands) {
//       if (remainingIncome > limit) {
//         tax += limit * rate;
//         remainingIncome -= limit;
//       } else {
//         tax += remainingIncome * rate;
//         break;
//       }
//     }

//     return tax;
//   };

//   const totalIncome = techJob + otherIncome;
//   const payableTax =
//     currency === 'KES'
//       ? calculateKenyanPayableTax(totalIncome)
//       : calculateEthiopianPayableTax(totalIncome);

//   const earningsSubjectToIncomeSharing = totalIncome - payableTax
//   const amountDueToDirectEd = earningsSubjectToIncomeSharing * 0.2;
 
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'   

//   ];
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i);

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || '';
//   }


//   const handleCurrencyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
//     setCurrency(event.target.value);
//   };
  

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const token = getAuthToken();

//       // Make the API request with the Authorization header
//       const response = await apiClient.post(
//         '/api/income',
//         {
//           month,
//           year,
//           currency,
//           techJobEarnings: techJob,
//           otherEarnings: otherIncome,
//           totalEarnings: totalIncome,
//           payableTax,
//           earningsSubjectToIncomeSharing,
//           amountDueToDirectEd
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}` 
//           }
//         });
//       console.log(response)
//       setSuccessMessage('Income entry saved successfully.');
//       setError(null);
//       navigate('/dash-user')
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unknown error occurred.');
//       }
//       setSuccessMessage(null);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-28">
//         <h1 className="text-3xl font-bold mb-6 text-blue-600">Enter Monthly Earnings</h1>
//         <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex justify-between space-x-4">
//               <div className="w-1/2">
//                 <label className="block text-gray-700 mb-2">Month</label>
//                 <select
//                   value={month}
//                   onChange={(e) => setMonth(e.target.value)}
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   required
//                 >
//                   <option value="">Month</option>
//                   {monthNames.map((month, index) => (
//                     <option key={index} value={index + 1}>
//                       {month}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-gray-700 mb-2">Year</label>
//                 <select
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   required
//                 >
//                   <option value="">Year</option>
//                   {yearOptions.map((year) => (
//                     <option key={year} value={year}>
//                       {year}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Currency</label>
//               <select
//                 value={currency}
//                 onChange={handleCurrencyChange}
//                 className="w-full p-2 border-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               >
//                 <option value="KES">Kenyan Shilling (KES)</option>
//                 <option value="ETB">Ethiopian Birr (ETB)</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Tech Job Income</label>
//               <input
//                 type="number"
//                 value={techJob}
//                 onChange={(e) => setTechJob(Number(e.target.value))}
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Other Income</label>
//               <input
//                 type="number"
//                 value={otherIncome}
//                 onChange={(e) => setOtherIncome(Number(e.target.value))}
//                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Total Income</label>
//               <input
//                 type="number"
//                 value={totalIncome}
//                 readOnly
//                 className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Payable Tax</label>
//               <input
//                 type="number"
//                 value={payableTax}
//                 readOnly
//                 className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Earnings Subject to Income Sharing</label>
//               <input
//                 type="number"
//                 value={earningsSubjectToIncomeSharing}
//                 readOnly
//                 className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Amount Due to DirectEd</label>
//               <input
//                 type="number"
//                 value={amountDueToDirectEd}
//                 readOnly
//                 className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white py-2 rounded-lg w-full hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             >
//               Submit
//             </button>
//             {error && <p className="text-red-500 mt-4">{error}</p>}
//             {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncomeEntry;

import React, { useState } from 'react';
import apiClient from '../apiClient'; // Import your apiClient
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const IncomeEntry: React.FC = () => {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState('KES');
  const [techJob, setTechJob] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const calculateKenyanPayableTax = (monthlyIncome:number) => {
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

  const totalIncome = techJob + otherIncome;
  const payableTax =
    currency === 'KES'
      ? calculateKenyanPayableTax(totalIncome)
      : calculateEthiopianPayableTax(totalIncome);

  const earningsSubjectToIncomeSharing = totalIncome - payableTax
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
      navigate('/dash-user')
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
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <div className="w-full sm:w-1/2">
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
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="ETB">Ethiopian Birr (ETB)</option>
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Tech Job Income</label>
                <input
                  type="number"
                  value={techJob}
                  onChange={(e) => setTechJob(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Other Income</label>
                <input
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Total Income</label>
                <input
                  type="number"
                  value={totalIncome}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Payable Tax</label>
                <input
                  type="number"
                  value={payableTax}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-gray-700 mb-2">Earnings Subject to Income Sharing</label>
                <input
                  type="number"
                  value={earningsSubjectToIncomeSharing}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
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
