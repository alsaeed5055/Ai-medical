
import React from 'react';
import { UserRole } from '../types';
import { useAppContext } from '../App';
import { StethoscopeIcon, UserIcon, UsersIcon, ShoppingCartIcon } from './Icons';

const Header: React.FC = () => {
  const { userRole, setUserRole } = useAppContext();

  const roles = [
    { role: UserRole.Customer, icon: <ShoppingCartIcon className="w-5 h-5" /> },
    { role: UserRole.ShopOwner, icon: <StethoscopeIcon className="w-5 h-5" /> },
    { role: UserRole.Admin, icon: <UsersIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <div className="bg-teal-500 p-2 rounded-full text-white">
                <StethoscopeIcon className="w-6 h-6"/>
            </div>
            <h1 className="text-2xl font-bold text-teal-600">Dawaa Dost</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500 hidden sm:block">Viewing as:</span>
            <div className="relative">
              <select
                id="role-switcher"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="appearance-none w-full bg-gray-100 border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {roles.map(({ role }) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <UserIcon className="w-4 h-4" />
                </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
