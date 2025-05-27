export interface Store {
  id: string;
  name: string;
  ownerId: string; // Firebase UID
  address: string;
  isOpen: boolean;
  createdAt?: any;
}
