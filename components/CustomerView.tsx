
import React, { useState, useMemo } from 'react';
import { Shop, Medicine, CartItem, ShopStatus, OrderStatus } from '../types';
import { useData } from '../hooks/useMockData';
import { StoreIcon, ArrowLeftIcon, ShoppingCartIcon, InfoIcon, XIcon, PackageIcon, ClockIcon } from './Icons';
import { getMedicineInfo } from '../services/geminiService';
import { useToasts } from './Toaster';

// Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const MedicineInfo: React.FC<{ medicineName: string }> = ({ medicineName }) => {
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            const result = await getMedicineInfo(medicineName);
            setInfo(result);
            setLoading(false);
        };
        fetchInfo();
    }, [medicineName]);

    if (loading) {
        return <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Fetching information...</p>
        </div>;
    }

    // A simple markdown renderer
    const renderMarkdown = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (line.startsWith('###')) return <h3 key={index} className="text-md font-semibold mt-2 mb-1">{line.replace('###', '')}</h3>;
            if (line.startsWith('**')) return <p key={index} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
            if (line.startsWith('* ')) return <li key={index} className="ml-4 list-disc">{line.replace('* ', '')}</li>;
            return <p key={index} className="my-1">{line}</p>;
        });
    };

    return <div>{renderMarkdown(info)}</div>;
};


// Main Customer View
const CustomerView: React.FC = () => {
    const { shops, orders, addOrder } = useData();
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const { addToast } = useToasts();

    const approvedShops = useMemo(() => shops.filter(s => s.status === ShopStatus.Approved), [shops]);

    const addToCart = (medicine: Medicine) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.medicine.id === medicine.id);
            if (existingItem) {
                return prevCart.map(item => item.medicine.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { medicine, quantity: 1 }];
        });
        addToast(`${medicine.name} added to cart!`, 'success');
    };

    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.medicine.price * item.quantity, 0), [cart]);

    const handlePlaceOrder = () => {
        if (cart.length > 0 && selectedShop) {
            addOrder({
                shopId: selectedShop.id,
                shopName: selectedShop.name,
                items: cart,
                total: cartTotal,
                status: OrderStatus.Pending,
                customerName: 'Customer Name' // Hardcoded for demo
            });
            setCart([]);
            setIsCartOpen(false);
            addToast('Order placed successfully!', 'success');
            setIsOrdersOpen(true);
        }
    };

    const handleShowInfo = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setIsInfoModalOpen(true);
    };

    if (selectedShop) {
        return (
            <div className="max-w-7xl mx-auto">
                <button onClick={() => setSelectedShop(null)} className="flex items-center text-teal-600 font-semibold mb-4 hover:text-teal-800">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Shops
                </button>
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">{selectedShop.name}</h2>
                    <p className="text-gray-500">{selectedShop.address}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {selectedShop.inventory.map(med => (
                        <div key={med.id} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800">{med.name}</h3>
                                <p className="text-lg font-bold text-teal-600">${med.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">Stock: {med.stock > 0 ? med.stock : 'Out of stock'}</p>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <button onClick={() => addToCart(med)} disabled={med.stock <= 0} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed">Add to Cart</button>
                                <button onClick={() => handleShowInfo(med)} className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md">
                                    <InfoIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-3xl font-bold text-gray-800">Available Pharmacies</h2>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsOrdersOpen(true)} className="relative px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        My Orders
                        {orders.filter(o => o.status !== OrderStatus.Completed).length > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs text-white">{orders.filter(o => o.status !== OrderStatus.Completed).length}</span>}
                    </button>
                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                        <ShoppingCartIcon className="w-6 h-6"/>
                        {cart.length > 0 && <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">{cart.length}</span>}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedShops.map(shop => (
                    <div key={shop.id} onClick={() => setSelectedShop(shop)} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:border-teal-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center space-x-4">
                            <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
                                <StoreIcon className="w-7 h-7"/>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{shop.name}</h3>
                                <p className="text-gray-600">{shop.address}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart Modal */}
            <Modal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title={`Cart from ${selectedShop?.name || '...'}`}>
                {cart.length > 0 ? (
                    <div>
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.medicine.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.medicine.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.medicine.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button onClick={handlePlaceOrder} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition">Place Pickup Order</button>
                        </div>
                    </div>
                ) : <p className="text-gray-500 text-center py-4">Your cart is empty. Add items from a selected shop.</p>}
            </Modal>

            {/* My Orders Modal */}
            <Modal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} title="My Pickup Orders">
                 {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="p-4 border rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{order.shopName}</p>
                                        <p className="text-sm text-gray-500">Order #{order.id.slice(-6)}</p>
                                    </div>
                                    <div className={`flex items-center px-2 py-1 text-xs font-semibold rounded-full ${order.status === OrderStatus.Pending ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {order.status === OrderStatus.Pending ? <ClockIcon className="w-3 h-3 mr-1"/> : <PackageIcon className="w-3 h-3 mr-1"/>}
                                        {order.status}
                                    </div>
                                </div>
                                 <p className="text-sm mt-2 font-bold text-right">Total: ${order.total.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                 ) : <p className="text-gray-500 text-center py-4">You haven't placed any orders yet.</p>}
            </Modal>
            
            {/* Medicine Info Modal */}
            <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title={selectedMedicine?.name || 'Medicine Information'}>
                {selectedMedicine && <MedicineInfo medicineName={selectedMedicine.name} />}
            </Modal>
        </div>
    );
};

export default CustomerView;
