import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient'; // Import your apiClient
import Navbar from '../components/adminNav';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  if (error) return <p className="text-red-500">{error}</p>;



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

    // Extract the first letter of the email
    const emailInitial = email ? email.charAt(0).toUpperCase() : '?';

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="bg-white shadow-md p-4 mb-6 w-full max-w-lg flex items-center justify-center">
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
                selectedYear === 2023 ? 'bg-green-700 px-8' : ''
              }`}
            >
              2023
            </button>
            <button
              onClick={() => handleYearClick(2024)}
              className={`bg-green-500 text-white p-2 rounded m-2 px-8${
                selectedYear === 2024 ? 'bg-green-700 px-8' : ''
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
        <strong>Name:</strong> {selectedStudent.parentFirstName} {selectedStudent.parentMiddleName} {selectedStudent.parentLastName}
      </p>
      <p>
        <strong>Email:</strong> {selectedStudent.parentEmail}
      </p>
      <p>
        <strong>Mobile Phone:</strong> {selectedStudent.parentMobilePhone}
      </p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {selectedStudent.incomes.length > 0 ? (
    selectedStudent.incomes.map((income: any, index: number) => (
      <div
        key={index}
        className="bg-blue-100 p-4 border rounded-lg shadow-md transition transform hover:scale-105"
      >
        <p className="font-semibold mb-2">
          {income.month || 'N/A'} {income.year || 'N/A'}
        </p>
        <p className="mb-1">
          <strong>Projected Income:</strong>
        </p>
        <p className="text-sm">
          Tech Job - ${income.techJobEarnings || 'N/A'}, Other - $
          {income.otherEarnings || 'N/A'}
        </p>
        <p className="mt-2 mb-1">
          <strong>Actual Income:</strong>
        </p>
        <p className="text-sm">
          Tech Job - ${income.techJobEarnings || 'N/A'}, Other - $
          {income.otherEarnings || 'N/A'}
        </p>
        <p className="mt-2">
          <strong>Earnings Subject to Income Sharing:</strong>
        </p>
        <p className="text-sm">
          ${income.earningsSubjectToIncomeSharing || 'N/A'}
        </p>
        <p className="mt-2">
          <strong>Amount Due to DirectEd:</strong>
        </p>
        <p className="text-sm">${income.amountDueToDirectEd || 'N/A'}</p>
      </div>
    ))
  ) : (
    <p className="text-center col-span-1 sm:col-span-2 text-red-500">
      No income data available.
    </p>
  )}
</div>

                <button
                  onClick={() => setSelectedStudent(null)}
                  className="bg-gray-500 text-white p-2 rounded mt-6 block mx-auto hover:bg-gray-600 transition"
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
