import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, signup } from './authService'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
// import jwtDecode from 'jwt-decode';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg flex flex-col md:flex-row">
        <div className="md:w-1/3 p-6 bg-blue-500 flex items-center justify-center">
        <img src="/DirectEd Development Logo horizontal white.png" alt="Logo" className="h-10 w-auto" />
        </div>
        <div className="md:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
          {isSignUp ? (
            <SignUpForm />
          ) : (
            <LoginForm />
          )}
          <Link to={'/admin-login'} className='font-bold text-blue-700 mr-28'>Admin?</Link>
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-blue-500 mt-4 hover:text-blue-800 hover:font-bold"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SignUpForm: React.FC = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [countryOfResidence, setCountryOfResidence] = useState('');
  const [cohortYear, setCohortYear] = useState<number>(new Date().getFullYear());
  const [parentFirstName, setParentFirstName] = useState('');
  const [parentMiddleName, setParentMiddleName] = useState('');
  const [parentLastName, setParentLastName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentMobilePhone, setParentMobilePhone] = useState('');
  const [error, setError] = useState('');
  // const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await signup(
        email,
        password,
        firstName,
        middleName,
        lastName,
        mobilePhone,
        countryOfResidence,
        cohortYear,
        parentFirstName,
        parentMiddleName,
        parentLastName,
        parentEmail,
        parentMobilePhone
      );
      localStorage.setItem('email', data.email)
      // console.log('Signup successful:', data);
      // setMessage(data.message);
      alert(data.message)
      navigate('/dash-user')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {error && <div className="text-red-500 col-span-2">{error}</div>}
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Middle Name"
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="tel"
        placeholder="Mobile Phone Number"
        value={mobilePhone}
        onChange={(e) => setMobilePhone(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Country of Residence"
        value={countryOfResidence}
        onChange={(e) => setCountryOfResidence(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="number"
        placeholder="Cohort Year"
        value={cohortYear}
        onChange={(e) => setCohortYear(Number(e.target.value))}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Parent's First Name"
        value={parentFirstName}
        onChange={(e) => setParentFirstName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Parent's Middle Name"
        value={parentMiddleName}
        onChange={(e) => setParentMiddleName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="text"
        placeholder="Parent's Last Name"
        value={parentLastName}
        onChange={(e) => setParentLastName(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="email"
        placeholder="Parent's Email"
        value={parentEmail}
        onChange={(e) => setParentEmail(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="tel"
        placeholder="Parent's Mobile Phone Number"
        value={parentMobilePhone}
        onChange={(e) => setParentMobilePhone(e.target.value)}
        className="border rounded p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded p-2"
      />
      <button type="submit" className="col-span-1 md:col-span-2 bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
    </form>
  );
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(email, password);
      localStorage.setItem('email', data.email)
      // console.log('Login successful:', data);
      alert(data.message)
      navigate('/dash-user')
    }  catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 col-span-2">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full border rounded p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full border rounded p-2"
      />
      {/* <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Login
      </button> */}
       <button
        type="submit"
        className={`bg-blue-500 text-white p-2 rounded w-full flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading && (
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        )}
        Login
      </button>
   
      
    </form>
  );
};

export default AuthForm;


