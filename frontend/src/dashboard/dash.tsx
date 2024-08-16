import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import Navbar from '../components/adminNav';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorPage from '../Errors/errorPage';
import CurrencyConverter from '../components/CurrencyConverter';

const AdminDashboard: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 const  [currency, setCurrency] = useState<string>('KES');

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = getAuthToken();
        const response = await apiClient.get('/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching data');
      }
    };

    const fetchEmail = () => {
      const storedEmail = localStorage.getItem('email');
      setEmail(storedEmail || 'No email found');
    };

    fetchStudents();
    fetchEmail();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) return < ErrorPage />;

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
    setSelectedYear(null);
    setSelectedStudent(null);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setSelectedStudent(null);
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
  };

  const handleCurrencyChange = (newCurrency: string) => {
        setCurrency(newCurrency);
    };

  const filteredStudents = students.filter(
    (student) =>
      student.countryOfResidence === selectedCountry &&
      student.cohortYear === selectedYear
  );

  const monthNameToNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  // Extract the first letter of the email
  const emailInitial = email ? email.charAt(0).toUpperCase() : '?';

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-lg flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-lg">
              {emailInitial}
            </div>
            <p className="text-lg font-medium text-gray-700">{email}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center mb-6 space-x-4">
          <button
            onClick={() => handleCountryClick('USA')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold text-white transition ${
              selectedCountry === 'USA' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Ethiopia
          </button>
          <button
            onClick={() => handleCountryClick('Kenya')}
            className={`px-8 py-3 rounded-lg text-lg font-semibold text-white transition ${
              selectedCountry === 'Kenya' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Kenya
          </button>
        </div>
        {selectedCountry && (
          <div className="flex flex-wrap justify-center mb-4">
            <button
              onClick={() => handleYearClick(2023)}
              className={`bg-green-500 text-white p-2 rounded m-2 px-8 ${
                selectedYear === 2023 ? 'bg-green-700' : ''
              }`}
            >
              2023
            </button>
            <button
              onClick={() => handleYearClick(2024)}
              className={`bg-green-500 text-white p-2 rounded m-2 px-8 ${
                selectedYear === 2024 ? 'bg-green-700' : ''
              }`}
            >
              2024
            </button>
          </div>
        )}
        {selectedCountry && selectedYear && (
          <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {selectedCountry} - {selectedYear}
            </h2>
            {selectedStudent ? (
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-center">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <div className="my-12 flex flex-row justify-around">
                  <div>
                    <p>
                      <strong>Email:</strong> {selectedStudent.email}
                    </p>
                    <p>
                      <strong>Mobile Phone:</strong> {selectedStudent.mobilePhone}
                    </p>
                    <p>
                      <strong>Cohort Year:</strong> {selectedStudent.cohortYear}
                    </p>
                    <p>
                      <strong>Country of Residence:</strong> {selectedStudent.countryOfResidence}
                    </p>
                    <p>
                      <strong>Middle Name:</strong> {selectedStudent.middleName}
                    </p>
                  </div>
                  <div>
                    <p className="mt-4 font-bold">Parent/Guardian Details:</p>
                    <p>
                      <strong>Name:</strong> {selectedStudent.parentFirstName}{' '}
                      {selectedStudent.parentMiddleName} {selectedStudent.parentLastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedStudent.parentEmail}
                    </p>
                    <p>
                      <strong>Mobile Phone:</strong> {selectedStudent.parentMobilePhone}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold my-4 text-center">First Half of the Year</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedStudent.incomes.length > 0 ? (
                      selectedStudent.incomes
                        .filter((income: any) => {
                          const monthNumber =
                            monthNameToNumber[income.month as keyof typeof monthNameToNumber];
                          return monthNumber >= 1 && monthNumber <= 6;
                        })
                        .map((income: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg transition transform hover:scale-105"
                          >
                            <p className="font-bold mb-2">
                              {income.month || 'N/A'} {income.year || 'N/A'}
                            </p>
                            <div className="text-sm text-gray-700">
                              <p className="mb-1">
                                <strong>Projected Income:</strong>
                              </p>
                              <ul className="pl-4 list-disc">
                              <CurrencyConverter amount={income.techJobEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
                              <CurrencyConverter amount={income.otherEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
                              </ul>
                              <p className="mt-2 mb-1">
                                <strong>Actual Income:</strong>
                              </p>
                              <ul className="pl-4 list-disc">
                                <li>
                                  Tech Job - {income.currency} {income.techJobEarnings || 'N/A'}
                                </li>
                                <li>
                                  Other - {income.currency} {income.otherEarnings || 'N/A'}
                                </li>
                              </ul>
                              <p className="mt-2">
                                <strong>Payable Tax:</strong> {income.currency}{' '}
                                {income.payableTax || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Earnings Subject to Income Sharing:</strong> {income.currency}{' '}
                                {income.earningsSubjectToIncomeSharing || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Amount Due to DirectEd:</strong> {income.currency}{' '}
                                {income.amountDueToDirectEd || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Link:</strong>
                              </p>
                              <p className="text-sm break-words text-blue-600 underline cursor-pointer">
                                {income.link || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Comment:</strong>
                              </p>
                              <p className="text-sm break-words text-gray-600">
                                {income.comment || 'N/A'}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className='text-red-500 '>No income data available for this period.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold my-4 text-center">Second Half of the Year</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedStudent.incomes.length > 0 ? (
                      selectedStudent.incomes
                        .filter((income: any) => {
                          const monthNumber =
                            monthNameToNumber[income.month as keyof typeof monthNameToNumber];
                          return monthNumber >= 7 && monthNumber <= 12;
                        })
                        .map((income: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg transition transform hover:scale-105"
                          >
                            <p className="font-bold mb-2">
                              {income.month || 'N/A'} {income.year || 'N/A'}
                            </p>
                            <div className="text-sm text-gray-700">
                              <p className="mb-1">
                                <strong>Projected Income:</strong>
                              </p>
                              <ul className="pl-4 list-disc">
                                <li className='flex flex-row items-center gap-1'>
                                  Tech Job - <CurrencyConverter amount={income.techJobEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
                                </li>
                                <li>
                                  Other - {income.currency} {income.otherEarnings || 'N/A'}
                                </li>
                              </ul>
                              <p className="mt-2 mb-1">
                                <strong>Actual Income:</strong>
                              </p>
                              <ul className="pl-4 list-disc">
                                <li>
                                  Tech Job - {income.currency} {income.techJobEarnings || 'N/A'}
                                </li>
                                <li>
                                  Other - {income.currency} {income.otherEarnings || 'N/A'}
                                </li>
                              </ul>
                              <p className="mt-2">
                                <strong>Payable Tax:</strong> {income.currency}{' '}
                                {income.payableTax || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Earnings Subject to Income Sharing:</strong> {income.currency}{' '}
                                {income.earningsSubjectToIncomeSharing || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Amount Due to DirectEd:</strong> {income.currency}{' '}
                                {income.amountDueToDirectEd || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Link:</strong>
                              </p>
                              <p className="text-sm break-words text-blue-600 underline cursor-pointer">
                                {income.link || 'N/A'}
                              </p>
                              <p className="mt-2">
                                <strong>Comment:</strong>
                              </p>
                              <p className="text-sm break-words text-gray-600">
                                {income.comment || 'N/A'}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className='text-red-500'>No income data available for this period.</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-red-500 text-white p-2 rounded m-2 mt-6 mx-auto block hover:bg-red-700"
                >
                  Back to Students List
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student: any) => (
                  <div
                    key={student._id}
                    className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105"
                    onClick={() => handleStudentClick(student)}
                  >
                    <h3 className="text-lg font-bold mb-2">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-700">Email: {student.email}</p>
                    <p className="text-sm text-gray-700">Mobile: {student.mobilePhone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import apiClient from '../apiClient'; Import your apiClient
// import Navbar from '../components/adminNav';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorPage from '../Errors/errorPage';
// import CurrencyConverter from '../components/CurrencyConverter';

// const AdminDashboard: React.FC = () => {
//   const [email, setEmail] = useState<string | null>(null);
//   const [students, setStudents] = useState<any[]>([]);
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currency, setCurrency] = useState<string>('KES'); // Default currency is KES

//   const getAuthToken = () => {
//     return localStorage.getItem('token') || '';
//   };

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const token = getAuthToken();
//         const response = await apiClient.get('/api/students', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log(response);
//         setStudents(response.data);
//       } catch (error) {
//         console.error('Error fetching students:', error);
//         setError('Error fetching data');
//       }
//     };

//     const fetchEmail = () => {
//       const storedEmail = localStorage.getItem('email');
//       setEmail(storedEmail || 'No email found');
//     };

//     fetchStudents();
//     fetchEmail();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <LoadingSpinner />
//       </div>
//     );
//   }
//   if (error) return < ErrorPage />;

//   const handleCountryClick = (country: string) => {
//     setSelectedCountry(country);
//     setSelectedYear(null);
//     setSelectedStudent(null);
//   };

//   const handleYearClick = (year: number) => {
//     setSelectedYear(year);
//     setSelectedStudent(null);
//   };

//   const handleStudentClick = (student: any) => {
//     setSelectedStudent(student);
//   };

//   const handleCurrencyChange = (newCurrency: string) => {
//     setCurrency(newCurrency);
//   };

//   const filteredStudents = students.filter(
//     (student) =>
//       student.countryOfResidence === selectedCountry &&
//       student.cohortYear === selectedYear
//   );

//   const monthNameToNumber = {
//     January: 1,
//     February: 2,
//     March: 3,
//     April: 4,
//     May: 5,
//     June: 6,
//     July: 7,
//     August: 8,
//     September: 9,
//     October: 10,
//     November: 11,
//     December: 12,
//   };

//   const emailInitial = email ? email.charAt(0).toUpperCase() : '?';

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
//         <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-lg flex items-center justify-center">
//           <div className="flex items-center space-x-4">
//             <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold text-lg">
//               {emailInitial}
//             </div>
//             <p className="text-lg font-medium text-gray-700">{email}</p>
//           </div>
//         </div>
//         <div className="flex flex-wrap justify-center mb-6 space-x-4">
//           <button
//             onClick={() => handleCountryClick('USA')}
//             className={`px-6 py-3 rounded-lg text-lg font-semibold text-white transition ${
//               selectedCountry === 'USA' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
//             }`}
//           >
//             USA
//           </button>
//           <button
//             onClick={() => handleCountryClick('Kenya')}
//             className={`px-8 py-3 rounded-lg text-lg font-semibold text-white transition ${
//               selectedCountry === 'Kenya' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
//             }`}
//           >
//             Kenya
//           </button>
//         </div>
//         {selectedCountry && (
//           <div className="flex flex-wrap justify-center mb-4">
//             <button
//               onClick={() => handleYearClick(2023)}
//               className={`bg-green-500 text-white p-2 rounded m-2 px-8 ${
//                 selectedYear === 2023 ? 'bg-green-700' : ''
//               }`}
//             >
//               2023
//             </button>
//             <button
//               onClick={() => handleYearClick(2024)}
//               className={`bg-green-500 text-white p-2 rounded m-2 px-8 ${
//                 selectedYear === 2024 ? 'bg-green-700' : ''
//               }`}
//             >
//               2024
//             </button>
//           </div>
//         )}
//         {selectedCountry && selectedYear && (
//           <div className="w-full bg-white shadow-md rounded-lg p-6">
//             <h2 className="text-xl font-bold mb-4">
//               {selectedCountry} - {selectedYear}
//             </h2>
//             {selectedStudent ? (
//               <div className="p-4 bg-white rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold mb-4 text-center">
//                   {selectedStudent.firstName} {selectedStudent.lastName}
//                 </h3>
//                 <div className="my-12 flex flex-row justify-around">
//                   <div>
//                     <p>
//                       <strong>Email:</strong> {selectedStudent.email}
//                     </p>
//                     <p>
//                       <strong>Mobile Phone:</strong> {selectedStudent.mobilePhone}
//                     </p>
//                     <p>
//                       <strong>Cohort Year:</strong> {selectedStudent.cohortYear}
//                     </p>
//                     <p>
//                       <strong>Country of Residence:</strong> {selectedStudent.countryOfResidence}
//                     </p>
//                     <p>
//                       <strong>Middle Name:</strong> {selectedStudent.middleName}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="mt-4 font-bold">Parent/Guardian Details:</p>
//                     <p>
//                       <strong>Name:</strong> {selectedStudent.parentFirstName}{' '}
//                       {selectedStudent.parentMiddleName} {selectedStudent.parentLastName}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {selectedStudent.parentEmail}
//                     </p>
//                     <p>
//                       <strong>Mobile Phone:</strong> {selectedStudent.parentMobilePhone}
//                     </p>
//                   </div>
//                 </div>
//                 <CurrencyConverter
//                   amount={selectedStudent.incomes.reduce((acc: number, income: any) => acc + (income.techJobEarnings || 0) + (income.otherEarnings || 0), 0)}
//                   currency={currency}
//                   onCurrencyChange={handleCurrencyChange}
//                 />
//                 <div>
//                   <h4 className="text-lg font-bold my-4 text-center">First Half of the Year</h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {selectedStudent.incomes.length > 0 ? (
//                       selectedStudent.incomes
//                         .filter((income: any) => {
//                           const monthNumber =
//                             monthNameToNumber[income.month as keyof typeof monthNameToNumber];
//                           return monthNumber >= 1 && monthNumber <= 6;
//                         })
//                         .map((income: any, index: number) => (
//                           <div
//                             key={index}
//                             className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg transition transform hover:scale-105"
//                           >
//                             <p className="font-bold mb-2">
//                               {income.month || 'N/A'} {income.year || 'N/A'}
//                             </p>
//                             <div className="text-sm text-gray-700">
//                               <CurrencyConverter amount={income.techJobEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
//                               <CurrencyConverter amount={income.otherEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
//                               <p>
//                                 <strong>Total Earnings:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.totalEarnings || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                               <p>
//                                 <strong>Payable Tax:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.payableTax || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                               <p>
//                                 <strong>Earnings Subject to Income Sharing:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.earningsSubjectToIncomeSharing || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                               <p>
//                                 <strong>Amount Due to DirectEd:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.amountDueToDirectEd || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                             </div>
//                           </div>
//                         ))
//                     ) : (
//                       <p>No income data available for the first half of the year.</p>
//                     )}
//                   </div>
//                   <h4 className="text-lg font-bold my-4 text-center">Second Half of the Year</h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {selectedStudent.incomes.length > 0 ? (
//                       selectedStudent.incomes
//                         .filter((income: any) => {
//                           const monthNumber =
//                             monthNameToNumber[income.month as keyof typeof monthNameToNumber];
//                           return monthNumber >= 7 && monthNumber <= 12;
//                         })
//                         .map((income: any, index: number) => (
//                           <div
//                             key={index}
//                             className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg transition transform hover:scale-105"
//                           >
//                             <p className="font-bold mb-2">
//                               {income.month || 'N/A'} {income.year || 'N/A'}
//                             </p>
//                             <div className="text-sm text-gray-700">
//                               <CurrencyConverter amount={income.techJobEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
//                               <CurrencyConverter amount={income.otherEarnings || 0} currency={currency} onCurrencyChange={handleCurrencyChange} />
//                               <p>
//                                 <strong>Total Earnings:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.totalEarnings || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                               <p>
//                                 <strong>Payable Tax:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.payableTax || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                               <p>
//                                 <strong>Earnings Subject to Income Sharing:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.earningsSubjectToIncomeSharing || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                               <p>
//                                 <strong>Amount Due to DirectEd:</strong>{' '}
//                                 <CurrencyConverter
//                                   amount={income.amountDueToDirectEd || 0}
//                                   currency={currency}
//                                   onCurrencyChange={handleCurrencyChange}
//                                 />
//                               </p>
//                             </div>
//                           </div>
//                         ))
//                     ) : (
//                       <p>No income data available for the second half of the year.</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center">
//                 {filteredStudents.length > 0 ? (
//                   filteredStudents.map((student) => (
//                     <button
//                       key={student.id}
//                       onClick={() => handleStudentClick(student)}
//                       className="w-full p-4 border border-gray-200 rounded-lg shadow-md mb-4 transition transform hover:scale-105"
//                     >
//                       {student.firstName} {student.lastName}
//                     </button>
//                   ))
//                 ) : (
//                   <p>No students found for the selected country and year.</p>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


