
export enum UserRole {
  Admin = 'Admin',
  ShopOwner = 'Shop Owner',
  Customer = 'Customer',
}

export enum OrderStatus {
  Pending = 'Pending',
  ReadyForPickup = 'Ready for Pickup',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum ShopStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  status: ShopStatus;
  inventory: Medicine[];
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface Order {
  id: string;
  shopId: string;
  shopName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  orderDate: Date;
}
