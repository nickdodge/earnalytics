import React from 'react';
import Modal from './Modal';

interface FirstTimeWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlatform: () => void;
}

const FirstTimeWelcomeModal: React.FC<FirstTimeWelcomeModalProps> = ({
  isOpen,
  onClose,
  onAddPlatform,
}) => {
  const handleAddIncome = () => {
    window.location.href = '/settings';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              Welcome to Earnalytics! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Let's get started by connecting your platforms or adding your income manually.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onAddPlatform}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Connect Platform
            </button>
            <button
              onClick={handleAddIncome}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Add Income Manually
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FirstTimeWelcomeModal; 