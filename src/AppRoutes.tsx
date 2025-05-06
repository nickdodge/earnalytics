import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Settings from './pages/Settings';

interface AppRoutesProps {
  platforms: any[];
  manualIncomes: any[];
  onAddPlatform: (data: any) => void;
  onDeletePlatform: (platformName: string) => void;
  onUpdateManualIncome: (income: any) => void;
  onUpdatePlatform: (platform: any) => void;
  isModalOpen: boolean;
  onModalClose: () => void;
  onModalOpen: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  platforms,
  manualIncomes,
  onAddPlatform,
  onDeletePlatform,
  onUpdateManualIncome,
  onUpdatePlatform,
  isModalOpen,
  onModalClose,
  onModalOpen
}) => {
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '') || 'dashboard';

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block w-64">
        <Sidebar activeTab={currentPath} onTabChange={() => {}} />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard
            platforms={platforms}
            manualIncomes={manualIncomes}
            onAddPlatform={onAddPlatform}
            onDeletePlatform={onDeletePlatform}
            onUpdateManualIncome={onUpdateManualIncome}
            onUpdatePlatform={onUpdatePlatform}
            isModalOpen={isModalOpen}
            onModalClose={onModalClose}
            onModalOpen={onModalOpen}
          />} />
          <Route path="/dashboard" element={<Dashboard
            platforms={platforms}
            manualIncomes={manualIncomes}
            onAddPlatform={onAddPlatform}
            onDeletePlatform={onDeletePlatform}
            onUpdateManualIncome={onUpdateManualIncome}
            onUpdatePlatform={onUpdatePlatform}
            isModalOpen={isModalOpen}
            onModalClose={onModalClose}
            onModalOpen={onModalOpen}
          />} />
          <Route path="/insights" element={<Insights platforms={[...platforms, ...manualIncomes]} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppRoutes; 