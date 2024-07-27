// src/components/LoadingSpinner.tsx

import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/loading.json'; // Update this path to your Lottie JSON file

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie animationData={loadingAnimation} className="w-32 h-32" />
      <p className="mt-4 text-lg font-semibold text-blue-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
