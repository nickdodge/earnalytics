import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white dark:focus:bg-gray-800 focus:px-4 focus:py-2 focus:text-blue-500 focus:font-semibold focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink; 