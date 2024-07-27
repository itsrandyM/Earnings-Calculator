import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient'; // Import your apiClient
import Navbar from '../components/Navbar';

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = getAuthToken();
        const response = await apiClient.get('/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('token') || '';
  };

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

  const filteredStudents = students.filter(
    (student) =>
      student.countryOfResidence === selectedCountry &&
      student.cohortYear === selectedYear
  );

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex flex-wrap justify-center mb-4">
          <button
            onClick={() => handleCountryClick('USA')}
            className={`bg-blue-500 text-white p-2 rounded m-2 ${
              selectedCountry === 'USA' ? 'bg-blue-700' : ''
            }`}
          >
            USA
          </button>
          <button
            onClick={() => handleCountryClick('Kenya')}
            className={`bg-blue-500 text-white p-2 rounded m-2 ${
              selectedCountry === 'Kenya' ? 'bg-blue-700' : ''
            }`}
          >
            Kenya
          </button>
        </div>
        {selectedCountry && (
          <div className="flex flex-wrap justify-center mb-4">
            <button
              onClick={() => handleYearClick(2023)}
              className={`bg-green-500 text-white p-2 rounded m-2 ${
                selectedYear === 2023 ? 'bg-green-700' : ''
              }`}
            >
              2023
            </button>
            <button
              onClick={() => handleYearClick(2024)}
              className={`bg-green-500 text-white p-2 rounded m-2 ${
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
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                {selectedStudent.incomes.map((income: any, index: number) => (
                  <div key={index}>
                    <p>
                      Month: {income.month}, Year: {income.year}
                    </p>
                    <p>
                      Projected Income: Tech Job - ${income.techJobEarnings}, Other - ${income.otherEarnings}
                    </p>
                    <p>
                      Actual Income: Tech Job - ${income.techJobEarnings}, Other - ${income.otherEarnings}
                    </p>
                    <p>
                      Earnings Subject to Income Sharing: ${income.earningsSubjectToIncomeSharing}
                    </p>
                    <p>
                      Amount due to DirectEd: ${income.amountDueToDirectEd}
                    </p>
                  </div>
                ))}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-gray-500 text-white p-2 rounded mt-4"
                >
                  Back
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredStudents.map((student, index) => (
                  <li
                    key={index}
                    onClick={() => handleStudentClick(student)}
                    className="cursor-pointer p-2 border-b border-gray-200 hover:bg-gray-100"
                  >
                    {student.firstName} {student.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;



// import React, { useState } from 'react';
// import Navbar from '../components/Navbar';

// const adminData = {
//   "Kenya 2023": [
//     {
//       name: "John Doe",
//       projectedIncome: { techJob: 2000, other: 500 },
//       actualIncome: { techJob: 2100, other: 600 },
//     },
//     // Add more students as needed
//   ],
//   // Add more cohorts and countries as needed
// };

// const companyData = {
//   "Company A": [
//     {
//       name: "John Doe",
//       country: "Kenya",
//       year: 2023,
//       projectedIncome: { techJob: 2000, other: 500 },
//       actualIncome: { techJob: 2100, other: 600 },
//     },
//     // Add more students as needed
//   ],
//   // Add more companies as needed
// };

// const AdminDashboard: React.FC = () => {
//   const [selectedCountryYear, setSelectedCountryYear] = useState<string | null>(null);
//   const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

//   const handleCountryYearClick = (countryYear: string) => {
//     setSelectedCountryYear(countryYear);
//     setSelectedStudent(null);
//   };

//   const handleStudentClick = (student: any) => {
//     setSelectedStudent(student);
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
//         <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//         <div className="flex flex-wrap justify-center mb-4">
//           {Object.keys(adminData).map(countryYear => (
//             <button
//               key={countryYear}
//               onClick={() => handleCountryYearClick(countryYear)}
//               className="bg-blue-500 text-white p-2 rounded m-2"
//             >
//               {countryYear}
//             </button>
//           ))}
//         </div>
//         {selectedCountryYear && (
//           <div className="w-full bg-white shadow-md rounded-lg p-6">
//             <h2 className="text-xl font-bold mb-4">{selectedCountryYear}</h2>
//             {selectedStudent ? (
//               <div>
//                 <h3 className="text-lg font-bold mb-2">{selectedStudent.name}</h3>
//                 <p>Projected Income: Tech Job - ${selectedStudent.projectedIncome.techJob}, Other - ${selectedStudent.projectedIncome.other}</p>
//                 <p>Actual Income: Tech Job - ${selectedStudent.actualIncome.techJob}, Other - ${selectedStudent.actualIncome.other}</p>
//                 <p>Earnings Subject to Income Sharing: ${selectedStudent.projectedIncome.techJob + selectedStudent.projectedIncome.other}</p>
//                 <p>Amount due to DirectEd: ${(selectedStudent.projectedIncome.techJob + selectedStudent.projectedIncome.other) * 0.2}</p>
//                 <button onClick={() => setSelectedStudent(null)} className="bg-gray-500 text-white p-2 rounded mt-4">Back</button>
//               </div>
//             ) : (
//               <ul className="space-y-2">
//                 {adminData[selectedCountryYear].map((student, index) => (
//                   <li key={index} onClick={() => handleStudentClick(student)} className="cursor-pointer p-2 border-b border-gray-200 hover:bg-gray-100">
//                     {student.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
