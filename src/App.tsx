import React, { useState, useEffect } from 'react';
import { useAuth, useUser, SignIn } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import WelcomeModal from './components/WelcomeModal';
import FirstTimeWelcomeModal from './components/FirstTimeWelcomeModal';
import OnboardingModal from './components/OnboardingModal';
import PlatformConnectionModal from './components/PlatformConnectionModal';
import { useUserMetadata } from './utils/userMetadata';
import { secureStorage } from './utils/secureStorage';
import { platformData } from './data/mockData';
import { CustomIncomeEntry } from './types/CustomIncome';
import { PlatformData } from './data/mockData';

const App: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { hasCompletedOnboarding } = useUserMetadata();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFirstTimeWelcome, setShowFirstTimeWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPlatformConnection, setShowPlatformConnection] = useState(false);

  // Platform/income/modal state
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [manualIncomes, setManualIncomes] = useState<CustomIncomeEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      const saved = secureStorage.getItem('platforms');
      if (saved) {
        try {
          setPlatforms(saved);
        } catch (e) {
          setPlatforms(platformData);
        }
      } else {
        setPlatforms(platformData);
      }
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      const saved = secureStorage.getItem('manualIncomes');
      if (saved) {
        try {
          setManualIncomes(saved);
        } catch (e) {
          setManualIncomes([]);
        }
      } else {
        setManualIncomes([]);
      }
    }
  }, [isSignedIn]);

  // Save manualIncomes to storage when it changes
  useEffect(() => {
    if (isSignedIn && manualIncomes.length > 0) {
      secureStorage.setItem('manualIncomes', manualIncomes);
    }
  }, [isSignedIn, manualIncomes]);

  useEffect(() => {
    if (isSignedIn) secureStorage.setItem('platforms', platforms);
  }, [platforms, isSignedIn]);

  // Welcome modal logic
  useEffect(() => {
    if (isSignedIn) {
      const hasSeen = secureStorage.getItem('hasSeenOnboarding');
      setShowWelcome(!hasSeen);
    }
  }, [isSignedIn]);

  // First time welcome modal logic
  useEffect(() => {
    if (isSignedIn) {
      const hasSeenFirstTime = secureStorage.getItem('hasSeenFirstTimeWelcome');
      if (!hasSeenFirstTime) {
        setShowFirstTimeWelcome(true);
        secureStorage.setItem('hasSeenFirstTimeWelcome', true);
      }
    }
  }, [isSignedIn]);

  // Onboarding modal logic
  useEffect(() => {
    if (isLoaded && isSignedIn && user && !hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, [isLoaded, isSignedIn, user, hasCompletedOnboarding]);

  // Handlers for platform/income
  const handleAddPlatform = (data: { 
    name: string; 
    income: number; 
    notes?: string; 
    tags: string[]; 
    color?: string;
    logo?: string;
    type: 'platform' | 'manual';
    historicalEarnings: { month: string; amount: number }[];
  }) => {
    if (data.type === 'platform') {
      setPlatforms(prev => [...prev, {
        id: Date.now().toString(),
        name: data.name,
        income: data.income,
        notes: data.notes,
        tags: data.tags,
        color: data.color,
        logo: data.logo,
        textColor: 'text-gray-600',
        historicalEarnings: data.historicalEarnings || []
      }]);
    } else {
      setManualIncomes(prev => [...prev, {
        id: Date.now().toString(),
        name: data.name,
        income: data.income,
        notes: data.notes,
        tags: data.tags,
        color: data.color,
        logo: data.logo,
        type: 'manual',
        historicalEarnings: data.historicalEarnings || []
      }]);
    }
  };

  const handleDeletePlatform = (platformName: string) => {
    setPlatforms(prev => prev.filter(p => p.name !== platformName));
  };

  const handleUpdateManualIncome = (income: CustomIncomeEntry) => {
    setManualIncomes(prev => prev.map(i => i.id === income.id ? income : i));
  };

  const handleUpdatePlatform = (platform: PlatformData) => {
    setPlatforms(prev => prev.map(p => p.name === platform.name ? {
      ...platform,
      historicalEarnings: platform.historicalEarnings || []
    } : p));
  };

  const handleConnectPlatform = (platformId: string) => {
    // Find the platform data from our mock data
    const platform = platformData.find(p => p.id.toLowerCase() === platformId);
    if (platform) {
      // Add the platform using handleAddPlatform
      handleAddPlatform({
        name: platform.name,
        income: platform.income,
        tags: platform.tags,
        type: 'platform',
        historicalEarnings: platform.historicalEarnings
      });
      // Close the modal
      setShowPlatformConnection(false);
      // Close the first time welcome modal if it's open
      setShowFirstTimeWelcome(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isSignedIn ? (
        <div className="flex items-center justify-center min-h-screen">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                footerActionLink: 'text-blue-600 hover:text-blue-700',
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/"
          />
        </div>
      ) : (
        <>
          {showWelcome && <WelcomeModal />}
          {showFirstTimeWelcome && (
            <FirstTimeWelcomeModal
              isOpen={showFirstTimeWelcome}
              onClose={() => setShowFirstTimeWelcome(false)}
              onAddPlatform={() => setShowPlatformConnection(true)}
            />
          )}
          {showPlatformConnection && (
            <PlatformConnectionModal
              isOpen={showPlatformConnection}
              onClose={() => setShowPlatformConnection(false)}
              onConnect={handleConnectPlatform}
            />
          )}
          {showOnboarding && (
            <OnboardingModal
              isOpen={showOnboarding}
              onClose={() => setShowOnboarding(false)}
              onAddManualIncome={() => setShowOnboarding(false)}
            />
          )}
          <BrowserRouter>
            <AppRoutes
              platforms={platforms}
              manualIncomes={manualIncomes}
              onAddPlatform={handleAddPlatform}
              onDeletePlatform={handleDeletePlatform}
              onUpdateManualIncome={handleUpdateManualIncome}
              onUpdatePlatform={handleUpdatePlatform}
              isModalOpen={isModalOpen}
              onModalClose={() => setIsModalOpen(false)}
              onModalOpen={() => setIsModalOpen(true)}
            />
          </BrowserRouter>
        </>
      )}
    </div>
  );
};

export default App;
