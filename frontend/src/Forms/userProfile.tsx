import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import apiClient from '../apiClient';
import LoadingSpinner from '../components/LoadingSpinner';

interface UserDetails {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password?: string;
  mobilePhone?: string;
  countryOfResidence: string;
  cohortYear: number;
  parentFirstName?: string;
  parentMiddleName?: string;
  parentLastName?: string;
  parentEmail?: string;
  parentMobilePhone?: string;
}

const UserAccountDetails: React.FC = () => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [originalUser, setOriginalUser] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string | null>(null);

  const location = useLocation(); // Use useLocation to get the state
  const userId = location.state?.userId; // Get userId from state

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        if (!userId) throw new Error('User ID not provided');

        const response = await apiClient.get(`/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
        setOriginalUser(response.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, [name]: value };
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      if (!user || !originalUser) throw new Error('User details are not loaded');

      const updates: Partial<UserDetails> = {};
      Object.keys(user).forEach((key) => {
        const userKey = key as keyof UserDetails;
        if (user[userKey] !== originalUser[userKey]) {
          updates[userKey] = user[userKey];
        }
      });

      if (Object.keys(updates).length === 0) {
        setError('No changes to update.');
        return;
      }

      const response = await apiClient.patch(`/api/users/${user._id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('User updated successfully');
      setUser(response.data.update); // Update local state with new user data
      setOriginalUser(response.data.update); // Sync original data with updated data
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }
// import React, { useEffect, useState } from 'react';
// import apiClient from '../apiClient';
// import LoadingSpinner from '../components/LoadingSpinner';


// interface UserDetails {
//   _id: string;
//   firstName: string;
//   middleName?: string;
//   lastName: string;
//   email: string;
//   password?: string;
//   mobilePhone?: string;
//   countryOfResidence: string;
//   cohortYear: number;
//   parentFirstName?: string;
//   parentMiddleName?: string;
//   parentLastName?: string;
//   parentEmail?: string;
//   parentMobilePhone?: string;
// }

// const UserAccountDetails: React.FC = () => {
//   const [user, setUser] = useState<UserDetails | null>(null);
//   const [originalUser, setOriginalUser] = useState<UserDetails | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [success, setSuccess] = useState<string | null>(null);

//   const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No token found');

//         const response = await apiClient.get(`/api/user/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setUser(response.data);
//         setOriginalUser(response.data);
//       } catch (error) {
//         if (error instanceof Error) {
//           setError(error.message);
//         } else {
//           setError('An unknown error occurred.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [userId]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUser((prevUser) => {
//       if (!prevUser) return null;
//       return { ...prevUser, [name]: value };
//     });
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No token found');

//       if (!user || !originalUser) throw new Error('User details are not loaded');

//       // Create an object with only the changed fields
//       const updates: Partial<UserDetails> = {};
//       Object.keys(user).forEach((key) => {
//         const userKey = key as keyof UserDetails;
//         if (user[userKey] !== originalUser[userKey]) {
//           updates[userKey] = user[userKey];
//         }
//       });

//       if (Object.keys(updates).length === 0) {
//         setError('No changes to update.');
//         return;
//       }

//       const response = await apiClient.patch(`/api/users/${user._id}`, updates, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       setSuccess('User updated successfully');
//       setUser(response.data.update); // Update local state with new user data
//       setOriginalUser(response.data.update); // Sync original data with updated data
//     } catch (error) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError('An unknown error occurred.');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            value={user?.firstName || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            name="middleName"
            value={user?.middleName || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user?.lastName || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={user?.email || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={user?.password || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="mobilePhone">Mobile Phone</label>
          <input
            type="text"
            name="mobilePhone"
            value={user?.mobilePhone || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="countryOfResidence">Country of Residence</label>
          <input
            type="text"
            name="countryOfResidence"
            value={user?.countryOfResidence || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="cohortYear">Cohort Year</label>
          <input
            type="number"
            name="cohortYear"
            value={user?.cohortYear || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="parentFirstName">Parent First Name</label>
          <input
            type="text"
            name="parentFirstName"
            value={user?.parentFirstName || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="parentMiddleName">Parent Middle Name</label>
          <input
            type="text"
            name="parentMiddleName"
            value={user?.parentMiddleName || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="parentLastName">Parent Last Name</label>
          <input
            type="text"
            name="parentLastName"
            value={user?.parentLastName || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="parentEmail">Parent Email</label>
          <input
            type="email"
            name="parentEmail"
            value={user?.parentEmail || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="parentMobilePhone">Parent Mobile Phone</label>
          <input
            type="text"
            name="parentMobilePhone"
            value={user?.parentMobilePhone || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {success && <p className="text-green-500 mb-4">{success}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Update Details
        </button>
      </form>
    </div>
  );
};

export default UserAccountDetails;
