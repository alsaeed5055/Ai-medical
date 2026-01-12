
import React from 'react';
import { useData } from '../hooks/useMockData';
import { Shop, ShopStatus } from '../types';
import { CheckCircleIcon, XCircleIcon, StoreIcon, UserCircleIcon } from './Icons';
import { useToasts } from './Toaster';

const ShopRequestCard: React.FC<{ shop: Shop }> = ({ shop }) => {
  const { updateShopStatus } = useData();
  const { addToast } = useToasts();

  const handleApprove = () => {
    updateShopStatus(shop.id, ShopStatus.Approved);
    addToast('Shop approved successfully!', 'success');
  };

  const handleReject = () => {
    updateShopStatus(shop.id, ShopStatus.Rejected);
    addToast('Shop rejected.', 'error');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <StoreIcon className="w-6 h-6"/>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{shop.name}</p>
          <p className="text-sm text-gray-500">{shop.address}</p>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <UserCircleIcon className="w-4 h-4 mr-1.5"/>
            <span>{shop.ownerName}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-3 self-end sm:self-center">
        <button onClick={handleApprove} className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          <CheckCircleIcon className="w-5 h-5 mr-2"/> Approve
        </button>
        <button onClick={handleReject} className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          <XCircleIcon className="w-5 h-5 mr-2"/> Reject
        </button>
      </div>
    </div>
  );
};


const AdminDashboard: React.FC = () => {
  const { shops } = useData();

  const pendingShops = shops.filter(s => s.status === ShopStatus.Pending);
  const approvedShops = shops.filter(s => s.status === ShopStatus.Approved);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Pending Shop Requests ({pendingShops.length})</h2>
            {pendingShops.length > 0 ? (
                <div className="space-y-4">
                {pendingShops.map(shop => <ShopRequestCard key={shop.id} shop={shop} />)}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500 border border-dashed">
                <p>No pending requests at the moment.</p>
                </div>
            )}
        </div>
        <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Approved Shops ({approvedShops.length})</h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-h-[60vh] overflow-y-auto">
                <ul className="space-y-3">
                    {approvedShops.map(shop => (
                        <li key={shop.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50">
                           <div className="bg-green-100 text-green-600 p-2 rounded-full">
                                <CheckCircleIcon className="w-5 h-5"/>
                            </div>
                           <div>
                            <p className="font-medium text-gray-700">{shop.name}</p>
                            <p className="text-xs text-gray-500">{shop.address}</p>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
