import React from 'react';

interface PlatformConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: string) => void;
}

const platforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '🎥',
    description: 'Connect your YouTube channel to track ad revenue, memberships, and more.'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: '🎮',
    description: 'Connect your Twitch account to track subscriptions, bits, and ad revenue.'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    description: 'Connect your TikTok account to track creator fund earnings and brand deals.'
  }
];

const PlatformConnectionModal: React.FC<PlatformConnectionModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Connect Platform
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onConnect(platform.id)}
                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-start space-x-4"
              >
                <span className="text-3xl">{platform.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {platform.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {platform.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformConnectionModal; 