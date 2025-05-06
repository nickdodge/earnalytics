import React, { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
    window.location.href = `/${tab}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg"
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <span className="sr-only">Open menu</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className={`bg-white dark:bg-gray-800 shadow-lg h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4">
              <div className="flex flex-col items-center justify-between">
                <img 
                  src="/logo.png" 
                  alt="Earnalytics Logo" 
                  className="w-12 h-12 mb-2" 
                  width="48" 
                  height="48"
                />
                {!isCollapsed && (
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Earnalytics</h1>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isCollapsed ? '→' : '←'}
                </button>
              </div>
            </div>

            <nav className="flex-1 space-y-1 p-2">
              <button
                onClick={() => handleTabClick('dashboard')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
              >
                <span className="mr-3" aria-hidden="true">📊</span>
                {!isCollapsed && 'Dashboard'}
              </button>

              <button
                onClick={() => handleTabClick('insights')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'insights'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-current={activeTab === 'insights' ? 'page' : undefined}
              >
                <span className="mr-3" aria-hidden="true">📈</span>
                {!isCollapsed && 'Insights'}
              </button>

              <button
                onClick={() => handleTabClick('settings')}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'settings'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-current={activeTab === 'settings' ? 'page' : undefined}
              >
                <span className="mr-3" aria-hidden="true">⚙️</span>
                {!isCollapsed && 'Settings'}
              </button>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <a
                  href="/privacy"
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
                >
                  {!isCollapsed && 'Privacy Policy'}
                </a>
                <a
                  href="/terms"
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
                >
                  {!isCollapsed && 'Terms of Service'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
