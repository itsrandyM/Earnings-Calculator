import React, { useState } from 'react';

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg flex flex-col md:flex-row">
        <div className="md:w-1/3 p-6 bg-blue-500 flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold">Logo</h1>
        </div>
        <div className="md:w-2/3 p-6">
          <h2 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
          {isSignUp ? (
            <SignUpForm />
          ) : (
            <LoginForm />
          )}
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-blue-500 mt-4"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SignUpForm: React.FC = () => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input type="text" placeholder="First Name" className="border rounded p-2" />
      <input type="text" placeholder="Middle Name" className="border rounded p-2" />
      <input type="text" placeholder="Last Name" className="border rounded p-2" />
      <input type="email" placeholder="Email" className="border rounded p-2" />
      <input type="tel" placeholder="Mobile Phone Number" className="border rounded p-2" />
      <input type="text" placeholder="Country of Residence" className="border rounded p-2" />
      <input type="text" placeholder="Cohort Year" className="border rounded p-2" />
      <input type="text" placeholder="Parent's First Name" className="border rounded p-2" />
      <input type="text" placeholder="Parent's Middle Name" className="border rounded p-2" />
      <input type="text" placeholder="Parent's Last Name" className="border rounded p-2" />
      <input type="email" placeholder="Parent's Email" className="border rounded p-2" />
      <input type="tel" placeholder="Parent's Mobile Phone Number" className="border rounded p-2" />
      <button type="submit" className="col-span-1 md:col-span-2 bg-blue-500 text-white p-2 rounded">Sign Up</button>
    </form>
  );
};

const LoginForm: React.FC = () => {
  return (
    <form className="space-y-4">
      <input type="email" placeholder="Email" className="block w-full border rounded p-2" />
      <input type="password" placeholder="Password" className="block w-full border rounded p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
    </form>
  );
};

export default AuthForm;
