export interface Store {
  id?: string;            // Firebase Auth UID
  logoUrl?: string;       // Store logo URL
  ownerId?: string;       // Firebase Auth UID\
  storeAddress?: {
    lat?: number;         // Store latitude
    lng?: number;         // Store longitude
  };  // Store address
  businessCity?: string;  // Store city
  storeName?: string;     // Store name
}