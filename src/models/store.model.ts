export interface Store {
  uid?: string;            // Firebase Auth UID
  fullname: string;
  address: string;
  bir: string;             // BIR number
  contactNo: string;
  idNumber: string;        // Government ID or something
  businessName: string;
  location: string;
  logoURL?: string;        // Store logo image URL (optional)
  createdAt?: any;
}