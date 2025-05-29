export interface MenuItem {
  id?: string;
  name: string;
  description?: string;
  stock: number;
  price: number;
  discount: number;
  finalPrice: number;
  imageUrl?: string;
  isAvailable: boolean;
}
