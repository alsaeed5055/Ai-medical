
import React, { useState } from 'react';
import { useData } from '../hooks/useMockData';
import { Order, OrderStatus, Shop, ShopStatus } from '../types';
import { CheckCircleIcon, ClockIcon, PackageIcon, StoreIcon } from './Icons';
import { useToasts } from './Toaster';

const ShopRegistrationForm: React.FC<{ onRegister: (name: string, ownerName: string, address: string) => void }> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && ownerName && address) {
      onRegister(name, ownerName, address);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg border">
        <div className="text-center mb-6">
            <div className="inline-block bg-teal-100 text-teal-600 p-3 rounded-full mb-2">
                <StoreIcon className="w-8 h-8"/>
            </div>
          <h2 className="text-2xl font-bold text-gray-800">Register Your Pharmacy</h2>
          <p className="text-gray-500 mt-1">Join our network to reach more customers.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
            <input type="text" id="shopName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Owner Name</label>
            <input type="text" id="ownerName" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shop Address</label>
            <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300">Submit Registration</button>
        </form>
      </div>
    </div>
  );
};

const ShopDashboard: React.FC<{ shop: Shop }> = ({ shop }) => {
    const { orders, updateOrderStatus } = useData();
    const { addToast } = useToasts();
    const shopOrders = orders.filter(o => o.shopId === shop.id);

    const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
        updateOrderStatus(orderId, status);
        addToast(`Order marked as ${status}`, 'success');
    }

    const OrderCard: React.FC<{order: Order}> = ({ order }) => {
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-gray-800">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-gray-500">Customer: {order.customerName}</p>
                        <p className="text-sm text-gray-500">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(order.orderDate)}</p>
                    </div>
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === OrderStatus.Pending ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {order.status}
                    </span>
                </div>
                <div className="mt-4 border-t pt-4">
                    <ul className="text-sm space-y-1 text-gray-600">
                        {order.items.map(item => (
                            <li key={item.medicine.id} className="flex justify-between">
                                <span>{item.medicine.name} x {item.quantity}</span>
                                <span>${(item.medicine.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-right font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
                </div>
                 {order.status === OrderStatus.Pending && (
                    <div className="mt-4 flex justify-end">
                        <button onClick={() => handleUpdateStatus(order.id, OrderStatus.ReadyForPickup)} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition">
                            <PackageIcon className="w-5 h-5 mr-2" /> Mark as Ready for Pickup
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{shop.name}</h2>
                <p className="text-gray-500">{shop.address}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">New Orders</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {shopOrders.filter(o => o.status === OrderStatus.Pending).map(order => <OrderCard key={order.id} order={order} />)}
                        {shopOrders.filter(o => o.status === OrderStatus.Pending).length === 0 && <p className="text-gray-500 text-center py-4">No new orders.</p>}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Ready for Pickup</h3>
                     <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {shopOrders.filter(o => o.status === OrderStatus.ReadyForPickup).map(order => <OrderCard key={order.id} order={order} />)}
                        {shopOrders.filter(o => o.status === OrderStatus.ReadyForPickup).length === 0 && <p className="text-gray-500 text-center py-4">No orders are ready for pickup.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ShopOwnerView: React.FC = () => {
  const { shops, addShopRequest } = useData();
  const { addToast } = useToasts();
  // In a real app, this would be determined by authentication.
  // Here we'll just find the first shop owner that isn't the admin's demo shops.
  const myShop = shops.find(s => s.ownerName === 'New Owner');

  const handleRegister = (name: string, ownerName: string, address: string) => {
    addShopRequest({ name, ownerName: 'New Owner', address });
    addToast('Registration submitted! Please wait for admin approval.', 'info');
  };

  if (!myShop) {
    return <ShopRegistrationForm onRegister={handleRegister} />;
  }

  if (myShop.status === ShopStatus.Pending) {
    return (
      <div className="text-center mt-10 bg-white p-8 rounded-xl shadow-lg border max-w-lg mx-auto">
        <div className="inline-block bg-yellow-100 text-yellow-600 p-3 rounded-full mb-4">
            <ClockIcon className="w-8 h-8"/>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Registration Pending</h2>
        <p className="text-gray-600 mt-2">Your shop, "{myShop.name}", is awaiting approval from the administrator. You will be able to access your dashboard once approved.</p>
      </div>
    );
  }
  
  if (myShop.status === ShopStatus.Rejected) {
    return (
      <div className="text-center mt-10 bg-white p-8 rounded-xl shadow-lg border max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-red-600">Registration Rejected</h2>
        <p className="text-gray-600 mt-2">We're sorry, your registration for "{myShop.name}" was not approved. Please contact support for more information.</p>
      </div>
    );
  }

  return <ShopDashboard shop={myShop} />;
};

export default ShopOwnerView;
