import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const adminData = {
  "Kenya 2023": [
    {
      name: "John Doe",
      projectedIncome: { techJob: 2000, other: 500 },
      actualIncome: { techJob: 2100, other: 600 },
    },
    // Add more students as needed
  ],
  // Add more cohorts and countries as needed
};

const companyData = {
  "Company A": [
    {
      name: "John Doe",
      country: "Kenya",
      year: 2023,
      projectedIncome: { techJob: 2000, other: 500 },
      actualIncome: { techJob: 2100, other: 600 },
    },
    // Add more students as needed
  ],
  // Add more companies as needed
};

const AdminDashboard: React.FC = () => {
  const [selectedCountryYear, setSelectedCountryYear] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const handleCountryYearClick = (countryYear: string) => {
    setSelectedCountryYear(countryYear);
    setSelectedStudent(null);
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex flex-wrap justify-center mb-4">
          {Object.keys(adminData).map(countryYear => (
            <button
              key={countryYear}
              onClick={() => handleCountryYearClick(countryYear)}
              className="bg-blue-500 text-white p-2 rounded m-2"
            >
              {countryYear}
            </button>
          ))}
        </div>
        {selectedCountryYear && (
          <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{selectedCountryYear}</h2>
            {selectedStudent ? (
              <div>
                <h3 className="text-lg font-bold mb-2">{selectedStudent.name}</h3>
                <p>Projected Income: Tech Job - ${selectedStudent.projectedIncome.techJob}, Other - ${selectedStudent.projectedIncome.other}</p>
                <p>Actual Income: Tech Job - ${selectedStudent.actualIncome.techJob}, Other - ${selectedStudent.actualIncome.other}</p>
                <p>Earnings Subject to Income Sharing: ${selectedStudent.projectedIncome.techJob + selectedStudent.projectedIncome.other}</p>
                <p>Amount due to DirectEd: ${(selectedStudent.projectedIncome.techJob + selectedStudent.projectedIncome.other) * 0.2}</p>
                <button onClick={() => setSelectedStudent(null)} className="bg-gray-500 text-white p-2 rounded mt-4">Back</button>
              </div>
            ) : (
              <ul className="space-y-2">
                {adminData[selectedCountryYear].map((student, index) => (
                  <li key={index} onClick={() => handleStudentClick(student)} className="cursor-pointer p-2 border-b border-gray-200 hover:bg-gray-100">
                    {student.name}
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
