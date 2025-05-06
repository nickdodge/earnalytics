import React, { useState } from 'react';
import { useUserMetadata } from '../utils/userMetadata';
import OAuthButtons from './OAuthButtons';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManualIncome: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onAddManualIncome }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const { markOnboardingComplete } = useUserMetadata();

  const handleConnectPlatform = (platform: string) => {
    setConnectedPlatforms(prev => [...prev, platform]);
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      await markOnboardingComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = async () => {
    await markOnboardingComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome to Earnalytics
          </h2>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Skip
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  step <= currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to Earnalytics! Let's help you track and analyze your income from various platforms.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              We'll guide you through connecting your platforms and setting up your income tracking.
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect your platforms to automatically track your earnings:
            </p>
            <OAuthButtons
              isLoggedIn={true}
              onConnectPlatform={handleConnectPlatform}
              connectedPlatforms={connectedPlatforms}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Would you like to add any manual income sources? This could include sponsorships, merchandise sales, or other revenue streams.
            </p>
            <button
              onClick={onAddManualIncome}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Manual Income
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currentStep === 3 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal; 