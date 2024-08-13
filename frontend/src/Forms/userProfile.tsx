 import React, { useEffect, useState } from 'react';
 import { useLocation } from 'react-router-dom';
 import apiClient from '../apiClient';
 import LoadingSpinner from '../components/LoadingSpinner';
 import Navbar from '../components/Navbar';

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
   const [isEditing, setIsEditing] = useState<boolean>(false);

   const location = useLocation();
   const userId = location.state?.userId;

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
         setError(error instanceof Error ? error.message : 'An unknown error occurred.');
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
           updates[userKey] = user[userKey] as UserDetails[typeof userKey];
         }
       });

       if (Object.keys(updates).length === 0) {
         setError('No changes to update.');
         return;
       }

       const response = await apiClient.patch(`/api/user/${user._id}`, updates, {
         headers: {
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
       });

       setSuccess('User updated successfully');
       setUser(response.data.update);
       setOriginalUser(response.data.update);
       setIsEditing(false);  
     } catch (error) {
       setError(error instanceof Error ? error.message : 'An unknown error occurred.');
     }
   };

   if (loading) {
     return (
       <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <LoadingSpinner />
       </div>
     );
   }

   return (
     <div className="min-h-screen bg-gray-100">
       <Navbar />
       <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
         <h1 className="text-3xl font-bold mt-20 mb-6">Account Details</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-4 rounded-lg shadow-sm">
             <h2 className="text-xl font-semibold mb-4 underline">Personal Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {Object.entries({
                 FirstName: user?.firstName,
                 MiddleName: user?.middleName,
                 LastName: user?.lastName,
                 MobilePhone: user?.mobilePhone,
                 Email: user?.email,
                 CountryOfResidence: user?.countryOfResidence,
                 CohortYear: user?.cohortYear,
               }).map(([label, value]) => (
                 <div key={label}>
                   <p className="text-gray-700 font-medium">{label}</p>
                   <p className="text-black">{value || 'N/A'}</p>
                 </div>
               ))}
             </div>
           </div>
           <div className="bg-white p-4 rounded-lg shadow-sm">
             <h2 className="text-xl font-semibold mb-4 underline">Parental Information</h2>
             <div className="flex flex-col space-y-4">
               {Object.entries({
                 ParentFirstName: user?.parentFirstName,
                 ParentMiddleName: user?.parentMiddleName,
                 ParentLastName: user?.parentLastName,
                 ParentEmail: user?.parentEmail,
                 ParentMobilePhone: user?.parentMobilePhone,
               }).map(([label, value]) => (
                 <div key={label}>
                   <p className="text-gray-700 font-medium">{label}</p>
                   <p className="text-black">{value || 'N/A'}</p>
                 </div>
               ))}
             </div>
           </div>
         </div>
         <div className="mt-8">
           {!isEditing ? (
             <button
               onClick={() => setIsEditing(true)}
               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
             >
               Edit Details
             </button>
           ) : (
             <form onSubmit={handleUpdate}>
               <h2 className="text-2xl font-semibold mb-4">Update Details</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { label: 'First Name', name: 'firstName', type: 'text' },
                   { label: 'Middle Name', name: 'middleName', type: 'text' },
                   { label: 'Last Name', name: 'lastName', type: 'text' },
                   { label: 'Email', name: 'email', type: 'email' },
                   { label: 'Mobile Phone', name: 'mobilePhone', type: 'text' },
                   { label: 'Country of Residence', name: 'countryOfResidence', type: 'text' },
                   { label: 'Cohort Year', name: 'cohortYear', type: 'number' },
                   { label: 'Parent First Name', name: 'parentFirstName', type: 'text' },
                   { label: 'Parent Middle Name', name: 'parentMiddleName', type: 'text' },
                   { label: 'Parent Last Name', name: 'parentLastName', type: 'text' },
                   { label: 'Parent Email', name: 'parentEmail', type: 'email' },
                   { label: 'Parent Mobile Phone', name: 'parentMobilePhone', type: 'text' },
                 ].map(({ label, name, type }) => (
                    <div key={name} className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-2">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={user ? user[name as keyof UserDetails] || '' : ''}
                      onChange={handleInputChange}
                      className="p-2 bg-[#e0f2ff] border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                 ))}
               </div>
               {success && <p className="text-green-500 mt-4">{success}</p>}
               {error && <p className="text-red-500 mt-4">{error}</p>}
               <div className='flex justify-around'>
               <button
                 type="submit"
                 className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 mr-2"
               >
                 Update Details
               </button>
               <button
                 type="button"
                 onClick={() => setIsEditing(false)}
                 className="mt-4 bg-red-300 text-gray-800 px-10 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-gray-300"
               >
                 Cancel
               </button>
               </div>
             </form>
           )}
         </div>
       </div>
     </div>
   );
 };

 export default UserAccountDetails;
