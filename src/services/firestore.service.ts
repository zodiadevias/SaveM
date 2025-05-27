import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, docData, query, where, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';
import { User } from '../models/user.model';
import { Store } from '../models/store.model';
import { MenuItem } from '../models/menu-item.model';
import { Order } from '../models/order.model';
import { Chat } from '../models/chat.model';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // 1. Add user profile
  async createUser(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      ...user,
      createdAt: Timestamp.now()
    });
  }

  // 2. Create store
  async createStore(store: any) {
    const ref = doc(this.firestore, `stores/${store.id}`);
    await setDoc(ref, {
      ...store,
      createdAt: Timestamp.now()
    });
  }

  // 3. Add food item to menu
  async addMenuItem(storeId: string, item: any) {
    const ref = collection(this.firestore, `stores/${storeId}/menu`);
    await addDoc(ref, item);
  }

  // 4. Place order
  async placeOrder(order: any) {
    const ref = collection(this.firestore, 'orders');
    return addDoc(ref, {
      ...order,
      createdAt: Timestamp.now(),
      status: 'pending'
    });
  }

  // 5. Send chat message
  async sendMessage(chatId: string, message: any) {
    const ref = collection(this.firestore, `storeChats/${chatId}/messages`);
    await addDoc(ref, {
      ...message,
      timestamp: Timestamp.now()
    });

    const chatRef = doc(this.firestore, `storeChats/${chatId}`);
    await updateDoc(chatRef, {
      lastMessage: message.text,
      updatedAt: Timestamp.now()
    });
  }

  // More methods: getUser, getOrdersByUser, getStoreChats, etc.
}
