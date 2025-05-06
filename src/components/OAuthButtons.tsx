import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface OAuthButtonsProps {
  isLoggedIn?: boolean;
  onConnectPlatform?: (platform: string) => void;
  connectedPlatforms?: string[];
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  isLoggedIn = false,
  onConnectPlatform,
  connectedPlatforms = []
}) => {
  const handleConnect = (platform: string) => {
    if (onConnectPlatform) {
      onConnectPlatform(platform);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-3">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                socialButtonsBlockButton: "w-full",
              },
            }}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or connect with
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {['Twitch', 'YouTube', 'TikTok'].map((platform) => (
            <button
              key={platform}
              onClick={() => handleConnect(platform)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-gray-700 dark:text-gray-200">
                {platform}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Connected Platforms
      </h3>
      <div className="space-y-3">
        {['Twitch', 'YouTube', 'TikTok'].map((platform) => (
          <button
            key={platform}
            onClick={() => handleConnect(platform)}
            disabled={connectedPlatforms.includes(platform)}
            className={`w-full flex items-center justify-between p-3 rounded-lg border ${
              connectedPlatforms.includes(platform)
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-gray-900 dark:text-gray-100">{platform}</span>
            </div>
            {connectedPlatforms.includes(platform) ? (
              <span className="text-green-500">Connected</span>
            ) : (
              <span className="text-blue-500">Connect</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OAuthButtons; 