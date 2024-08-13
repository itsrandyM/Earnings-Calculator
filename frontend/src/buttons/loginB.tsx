import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate a login request or add your login logic here
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulates an API call
    setIsLoading(false);
  };

  return (
    <button
      type="submit"
      className={`bg-blue-500 text-white p-2 rounded w-full flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading && (
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
      )}
      Login
    </button>
  );
}

export default LoginButton;
