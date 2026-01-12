
import React, { useState, createContext, useContext } from 'react';
import { UserRole } from './types';
import { useMockData, MockDataContext } from './hooks/useMockData';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import ShopOwnerView from './components/ShopOwnerView';
import CustomerView from './components/CustomerView';
import { Toaster } from './components/Toaster';

export const AppContext = createContext<{
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
} | null>(null);

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Customer);
  const mockData = useMockData();

  const renderView = () => {
    switch (userRole) {
      case UserRole.Admin:
        return <AdminDashboard />;
      case UserRole.ShopOwner:
        return <ShopOwnerView />;
      case UserRole.Customer:
      default:
        return <CustomerView />;
    }
  };

  return (
    <AppContext.Provider value={{ userRole, setUserRole }}>
      <MockDataContext.Provider value={mockData}>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            {renderView()}
          </main>
          <Toaster />
        </div>
      </MockDataContext.Provider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default App;
