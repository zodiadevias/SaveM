


export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'customer' | 'business';
  businessName?: string;
  location?: {
    lat: number;
    lng: number;
  };
  // ... add any other fields you use
}
