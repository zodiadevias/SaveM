export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'customer' | 'business';
  address?: string;
  phone?: string;
}
