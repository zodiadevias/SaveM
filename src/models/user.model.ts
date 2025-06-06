


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
  businessCity?: string;
  // ... add any other fields you use
}
