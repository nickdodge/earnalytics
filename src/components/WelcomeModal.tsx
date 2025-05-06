import React, { useEffect, useState } from 'react';

const WelcomeModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeen) {
      setOpen(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome to Earnalytics</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Track your creator platform earnings, visualize trends, and gain insights—all in one beautiful dashboard. Get started by adding your first income source or exploring the analytics!
        </p>
        <button
          onClick={handleContinue}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal; 