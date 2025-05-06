import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Welcome to Earnalytics
      </h1>
      <SignIn
        appearance={{
          elements: {
            card: "shadow-none bg-transparent",
            socialButtonsBlockButton: "w-full mb-2",
            formButtonPrimary: "w-full",
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
      />
    </div>
  </div>
);

export default Login; 