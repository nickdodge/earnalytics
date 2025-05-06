import React, { useState, useEffect } from 'react';
import IncomeCard from './IncomeCard';
import ManualIncomeCard from './ManualIncomeCard';
import AddPlatformModal from './AddPlatformModal';
import EditManualIncomeModal from './EditManualIncomeModal';
import EditPlatformModal from './EditPlatformModal';
import PlatformConnectionModal from './PlatformConnectionModal';
import CombinedLineChart from './CombinedLineChart';
import Toast from './Toast';
import SkipLink from './SkipLink';
import { PlatformData } from '../data/mockData';
import { CustomIncomeEntry } from '../types/CustomIncome';
import { calculateAllPlatformsMonthlyChanges, generateRevenueAlerts } from '../utils/incomeCalculations';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
}

type SortMethod = 'income' | 'name';

interface DashboardProps {
  platforms: PlatformData[];
  manualIncomes: CustomIncomeEntry[];
  onAddPlatform: (data: { 
    name: string; 
    income: number; 
    notes?: string; 
    tags: string[]; 
    color?: string;
    logo?: string;
    type: 'platform' | 'manual';
  }) => void;
  onDeletePlatform: (platformName: string) => void;
  onUpdateManualIncome: (income: CustomIncomeEntry) => void;
  onUpdatePlatform: (platform: PlatformData) => void;
  isModalOpen: boolean;
  onModalClose: () => void;
  onModalOpen: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  platforms,
  manualIncomes: manualIncomesProp,
  onAddPlatform,
  onDeletePlatform,
  onUpdateManualIncome,
  onUpdatePlatform,
  isModalOpen,
  onModalClose,
  onModalOpen
}) => {
  const [manualIncomes, setManualIncomes] = useState(manualIncomesProp);
  const [sortMethod, setSortMethod] = useState<SortMethod>('income');
  const [showSeparateLines, setShowSeparateLines] = useState(true);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<CustomIncomeEntry | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info', show: false });
  const [error, setError] = useState<string | null>(null);
  const [revenueAlerts, setRevenueAlerts] = useState<string[]>([]);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const totalEarnings = platforms.reduce((sum, platform) => sum + platform.income, 0);

  // Update manualIncomes state when prop changes
  useEffect(() => {
    setManualIncomes(manualIncomesProp);
  }, [manualIncomesProp]);

  // Function to check if we should show alerts this month
  const shouldShowAlertsThisMonth = (): boolean => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const lastAlertCheck = localStorage.getItem('lastAlertCheckDate');
      if (!lastAlertCheck) return true;
      
      const lastCheckDate = new Date(lastAlertCheck);
      return lastCheckDate.getMonth() !== currentMonth || lastCheckDate.getFullYear() !== currentYear;
    } catch (err) {
      console.error('Error checking alert date:', err);
      return true; // Default to showing alerts if there's an error
    }
  };

  // Function to update the last alert check date
  const updateLastAlertCheck = () => {
    try {
      localStorage.setItem('lastAlertCheckDate', new Date().toISOString());
    } catch (err) {
      console.error('Error updating alert check date:', err);
    }
  };

  useEffect(() => {
    let mounted = true;
    try {
      const timer = setTimeout(() => {
        if (!mounted) return;
        setIsLoading(false);
        
        try {
          // Check for revenue fluctuations after loading
          const changes = calculateAllPlatformsMonthlyChanges(platforms);
          const alerts = generateRevenueAlerts(changes);
          
          // Only show alerts if we haven't shown them this month
          if (shouldShowAlertsThisMonth() && alerts.length > 0) {
            setRevenueAlerts(alerts);
            updateLastAlertCheck();
          }
        } catch (err) {
          console.error('Error calculating revenue alerts:', err);
          // Don't set error state for non-critical errors
        }
      }, 1000);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    } catch (err) {
      console.error('Error in dashboard initialization:', err);
      setError('Failed to load dashboard data');
      setIsLoading(false);
    }
  }, [platforms]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, show: true });
  };

  const handleDeletePlatform = (platformName: string) => {
    try {
      onDeletePlatform(platformName);
      showToast(`${platformName} deleted successfully`, 'success');
    } catch (err) {
      showToast('Failed to delete platform', 'error');
    }
  };

  const handleUpdateIncome = (updatedIncome: CustomIncomeEntry) => {
    try {
      onUpdateManualIncome(updatedIncome);
      setEditingIncome(null);
      showToast('Income updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update income', 'error');
    }
  };

  const handleUpdatePlatform = (updatedPlatform: PlatformData) => {
    try {
      onUpdatePlatform(updatedPlatform);
      setEditingPlatform(null);
      showToast('Platform updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update platform', 'error');
    }
  };

  const handleDeleteManualIncome = (incomeId: string) => {
    try {
      setManualIncomes(prev => prev.filter(i => i.id !== incomeId));
      setToast({ message: 'Manual income deleted successfully', type: 'success', show: true });
    } catch (err) {
      setToast({ message: 'Failed to delete manual income', type: 'error', show: true });
    }
  };

  const sortedPlatforms = [...platforms].sort((a, b) => {
    if (sortMethod === 'income') {
      return b.income - a.income;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const handleConnectPlatform = (platformName: string) => {
    // Implementation for connecting to a platform
    console.log('Connecting to platform:', platformName);
    setIsConnectionModalOpen(false);
  };

  const handleEditIncome = (income: CustomIncomeEntry) => {
    setEditingIncome(income);
  };

  const handleEditPlatform = (platform: PlatformData) => {
    setEditingPlatform(platform);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4" data-testid="error-container">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (platforms.length === 0 && manualIncomes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4 max-w-md w-full mx-4">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200 text-center">No income sources added yet — click below to get started!</span>
          <button
            onClick={() => onModalOpen()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Add Income
          </button>
        </div>
        <AddPlatformModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onSubmit={onAddPlatform}
          existingPlatforms={[]}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="dashboard-container">
      <SkipLink />
      <div id="main-content" className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm animate-fade-in">
        {/* Info Banner */}
        {showInfoBanner && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Right now, income is entered manually. Auto-sync with Twitch, YouTube, and TikTok is coming soon!
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowInfoBanner(false)}
                  className="inline-flex text-blue-400 hover:text-blue-500 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Alerts Section */}
        {revenueAlerts.length > 0 && (
          <div className="space-y-2">
            {revenueAlerts.map((alert, index) => (
              <div
                key={index}
                className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 rounded-r-lg"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {alert}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Platform Analytics</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Earnings: <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">${totalEarnings.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="flex rounded-lg shadow-sm w-full sm:w-auto" role="group">
                <button
                  type="button"
                  onClick={() => setSortMethod('income')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    sortMethod === 'income'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  Sort by Income
                </button>
                <button
                  type="button"
                  onClick={() => setSortMethod('name')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    sortMethod === 'name'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  Sort by Name
                </button>
              </div>
              <button
                onClick={() => onModalOpen()}
                className="w-full sm:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Income
              </button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Earnings Overview</h2>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showSeparateLines}
                onChange={() => setShowSeparateLines(!showSeparateLines)}
                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle separate lines display"
              />
              <span>Show Separate Lines</span>
            </label>
          </div>
          <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[300px] px-4 sm:px-0">
              <CombinedLineChart sources={[...platforms, ...manualIncomes]} showSeparateLines={showSeparateLines} />
            </div>
          </div>
        </div>

        {/* Income Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlatforms.map((platform) => (
            <IncomeCard
              key={platform.id}
              platform={platform}
              onDelete={() => handleDeletePlatform(platform.name)}
              onEdit={() => handleEditPlatform(platform)}
            />
          ))}
          {manualIncomes.map((income) => (
            <ManualIncomeCard
              key={income.id}
              income={income}
              onDelete={() => handleDeleteManualIncome(income.id)}
              onEdit={() => handleEditIncome(income)}
            />
          ))}
        </div>

        {/* Modals */}
        <AddPlatformModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          onSubmit={onAddPlatform}
          existingPlatforms={platforms.map(p => p.name)}
        />
        <PlatformConnectionModal
          isOpen={isConnectionModalOpen}
          onClose={() => setIsConnectionModalOpen(false)}
          onConnect={handleConnectPlatform}
        />
        {editingIncome && (
          <EditManualIncomeModal
            isOpen={true}
            onClose={() => setEditingIncome(null)}
            onSubmit={handleUpdateIncome}
            income={editingIncome}
          />
        )}
        {editingPlatform && (
          <EditPlatformModal
            isOpen={true}
            onClose={() => setEditingPlatform(null)}
            onSubmit={handleUpdatePlatform}
            platform={editingPlatform}
          />
        )}

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 