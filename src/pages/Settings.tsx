import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';

const Settings: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        <div className="flex flex-col items-center space-y-4 mb-6">
          <img
            src={user.imageUrl || '/default-avatar.png'}
            alt="User avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-700 shadow"
          />
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user.fullName || user.username || 'User'}</h3>
            <p className="text-gray-600 dark:text-gray-300">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Email Address</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Password</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Connected Accounts</h3>
        <div className="space-y-4">
          {user.externalAccounts?.length > 0 ? (
            user.externalAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 dark:text-white">{account.provider}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{account.username || account.emailAddress}</span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">Connected</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No external accounts connected.</p>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100">Delete Account</h4>
              <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all associated data</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 