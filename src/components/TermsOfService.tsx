import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Terms of Service
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By accessing and using Earnalytics, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Earnalytics provides a platform for tracking and analyzing income from various sources. Our services include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
              <li>Income tracking and analytics</li>
              <li>Platform integration</li>
              <li>Financial insights and reporting</li>
              <li>Data visualization</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              As a user of Earnalytics, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not engage in any fraudulent or illegal activities</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              4. Service Limitations
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We strive to provide reliable service but cannot guarantee uninterrupted or error-free operation. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
              <li>Modify or discontinue any part of the service</li>
              <li>Restrict access to certain features</li>
              <li>Suspend or terminate accounts for violations</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              5. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              <a href="mailto:legal@earnalytics.com" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                legal@earnalytics.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 