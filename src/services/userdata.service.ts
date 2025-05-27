import { Injectable } from '@angular/core';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  constructor(private authService: AuthService) {}

async getUserData(): Promise<any | null> {
  const db = getFirestore();
  const user = this.authService.currentUser;

  if (user) {
    const uid = user.uid;
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data(); // 👈 All fields from the user document
      console.log('User data:', userData);
      return userData;
    } else {
      console.log('User document not found.');
      return null;
    }
  } else {
    console.log('No authenticated user.');
    return null;
  }
}
}
