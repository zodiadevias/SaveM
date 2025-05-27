export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  total: number;
  deliveryAddress: string;
  createdAt?: any;
}
