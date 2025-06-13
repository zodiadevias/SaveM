import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, docData, query, where, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';
import { User } from '../models/user.model';
import { Store } from '../models/store.model';
import { MenuItem } from '../models/menu-item.model';
import { Order } from '../models/order.model';
import { Chat } from '../models/chat.model';
import { Observable } from 'rxjs';
import { deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(public firestore: Firestore, private auth: Auth) {}

  // 1. Add user profile
  async createUser(user: User) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      ...user,
      createdAt: Timestamp.now(),
    });
  }

  // 2. Get user profile
  getUser(uid: string): Observable<User> {
    const ref = doc(this.firestore, `users/${uid}`);
    return docData(ref, { idField: 'uid' }) as Observable<User>;
  }

  // 2.1 Get user role
  async getUserRole(uid: string): Promise<string | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData['role'];
    } else {
      return null;
    }
  }

  updateUserProfile(uid: string, data: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, data);
  }

  updateStoreProfile(uid: string, data: any): Promise<void> {
    const storeRef = doc(this.firestore, `stores/${uid}`);
    return updateDoc(storeRef, data);
  }






  // 3. Get business name
  async getBusinessName(uid: string): Promise<string | null> {
    const userRef = doc(this.firestore, `users/${uid}`);
    
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData['businessName'];
    } else {
      return null;
    }
  }

  // 4. Get store details
  getStore(storeId: string): Observable<Store> {
    const ref = doc(this.firestore, `stores/${storeId}`);
    return docData(ref, { idField: 'id' }) as Observable<Store>;
  }

  // 5. Get stores
  getAllStores() {
  const ref = collection(this.firestore, 'stores');
  return collectionData(ref, { idField: 'id' }) as Observable<Store[]>;
}


  async updateLocation(uid: string, lat: number, lng: number): Promise<void> {
  const locationData = {
    location: {
      lat,
      lng,
    },
  };

  const userRef = doc(this.firestore, `users/${uid}`);
  const storeRef = doc(this.firestore, `stores/${uid}`);

  await updateDoc(userRef, locationData);
  await updateDoc(storeRef, locationData);
}


  // 5. Add food item to menu
  addMenuItem(storeId: string, item: any) {
    const menuCollection = collection(this.firestore, `stores/${storeId}/menu`);
    return addDoc(menuCollection, item);
  }

  // 6. Get menu items
  getMenuItems(storeId: string): Observable<MenuItem[]> {
    const ref = collection(this.firestore, `stores/${storeId}/menu`);
    return collectionData(ref, { idField: 'id' }) as Observable<MenuItem[]>;
  }

  // 6.2 Update menu item
  updateMenuItem(storeId: string, itemId: string, item: any): Promise<void> {
    const menuCollection = collection(this.firestore, `stores/${storeId}/menu`);
    const itemRef = doc(menuCollection, itemId);
    return updateDoc(itemRef, item);
  }
  
  
  // 6.1 Delete menu item
  deleteMenuItem(storeId: string, itemId: string): Promise<void> {
    const menuCollection = collection(this.firestore, `stores/${storeId}/menu`);
    const itemRef = doc(menuCollection, itemId);
    return deleteDoc(itemRef);
  }
  // 7. Place order
  async placeOrder(order: Order) {
    const ref = collection(this.firestore, 'orders');
    return addDoc(ref, {
      ...order,
      createdAt: Timestamp.now(),
      status: 'pending',
    });
  }

  // 8. Get orders by user
  getOrdersByUser(userId: string): Observable<Order[]> {
    const ref = collection(this.firestore, 'orders');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // 9. Send chat message
  async sendMessage(chatId: string, message: any) {
    const ref = collection(this.firestore, `storeChats/${chatId}/messages`);
    await addDoc(ref, {
      ...message,
      timestamp: Timestamp.now(),
    });

    const chatRef = doc(this.firestore, `storeChats/${chatId}`);
    await updateDoc(chatRef, {
      lastMessage: message.text,
      updatedAt: Timestamp.now(),
    });
  }

  // 10. Get chat messages
  getChatMessages(chatId: string): Observable<any[]> {
    const ref = collection(this.firestore, `storeChats/${chatId}/messages`);
    return collectionData(ref, { idField: 'id' });
  }
}
