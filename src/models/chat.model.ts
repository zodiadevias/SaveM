export interface Message {
  senderId: string;
  text: string;
  timestamp: any;
  seen?: boolean;
  type?: 'text' | 'image';
}

export interface Chat {
  id?: string;
  userId: string;
  storeId: string;
  participants: string[]; // [userId, storeOwnerId]
  lastMessage?: string;
  orderId?: string;
  updatedAt?: any;
}
