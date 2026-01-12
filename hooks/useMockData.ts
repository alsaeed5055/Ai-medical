
import { useState, createContext, useContext } from 'react';
import { Shop, Order, Medicine, ShopStatus, OrderStatus } from '../types';

// --- INITIAL MOCK DATA ---

const initialMedicines: Medicine[] = [
  { id: 'med1', name: 'Paracetamol 500mg', price: 2.50, stock: 100 },
  { id: 'med2', name: 'Ibuprofen 200mg', price: 4.00, stock: 80 },
  { id: 'med3', name: 'Aspirin 75mg', price: 3.20, stock: 50 },
  { id: 'med4', name: 'Loratadine 10mg', price: 8.00, stock: 60 },
  { id: 'med5', name: 'Amoxicillin 250mg', price: 12.50, stock: 30 },
  { id: 'med6', name: 'Cough Syrup 100ml', price: 6.00, stock: 75 },
];

const initialShops: Shop[] = [
  {
    id: 'shop1',
    name: 'City Health Pharmacy',
    address: '123 Main St, Anytown',
    ownerName: 'John Doe',
    status: ShopStatus.Approved,
    inventory: [...initialMedicines],
  },
  {
    id: 'shop2',
    name: 'Wellness Corner Meds',
    address: '456 Oak Ave, Anytown',
    ownerName: 'Jane Smith',
    status: ShopStatus.Approved,
    inventory: initialMedicines.slice(0, 4).map(m => ({...m, price: Math.round(m.price * 1.1 * 100)/100})),
  },
  {
    id: 'shop3',
    name: 'QuickCare Drugs',
    address: '789 Pine Ln, Otherville',
    ownerName: 'Peter Jones',
    status: ShopStatus.Pending,
    inventory: [],
  },
];

// --- HOOK LOGIC ---

export const useMockData = () => {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [orders, setOrders] = useState<Order[]>([]);

  const addShopRequest = (shopDetails: Omit<Shop, 'id' | 'status' | 'inventory'>) => {
    const newShop: Shop = {
      ...shopDetails,
      id: `shop${Date.now()}`,
      status: ShopStatus.Pending,
      inventory: [...initialMedicines], // Assign default inventory
    };
    setShops(prev => [...prev, newShop]);
  };

  const updateShopStatus = (shopId: string, status: ShopStatus.Approved | ShopStatus.Rejected) => {
    setShops(prev => prev.map(s => (s.id === shopId ? { ...s, status } : s)));
  };

  const addOrder = (order: Omit<Order, 'id' | 'orderDate'>) => {
    const newOrder: Order = {
      ...order,
      id: `order${Date.now()}`,
      orderDate: new Date(),
    };
    setOrders(prev => [newOrder, ...prev]);
    // Simulate stock reduction
    setShops(prevShops => prevShops.map(shop => {
        if (shop.id === order.shopId) {
            const newInventory = [...shop.inventory];
            order.items.forEach(item => {
                const medIndex = newInventory.findIndex(med => med.id === item.medicine.id);
                if (medIndex !== -1) {
                    newInventory[medIndex].stock -= item.quantity;
                }
            });
            return { ...shop, inventory: newInventory };
        }
        return shop;
    }));
  };
  
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
  };

  return {
    shops,
    orders,
    addShopRequest,
    updateShopStatus,
    addOrder,
    updateOrderStatus,
  };
};

// --- CONTEXT ---

export type MockDataContextType = ReturnType<typeof useMockData>;

export const MockDataContext = createContext<MockDataContextType | null>(null);

export const useData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useData must be used within a MockDataProvider');
  }
  return context;
};
