import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { GlobalService } from './global.service';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  user$: Observable<User | null> = authState(this.auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;

    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // User document doesn't exist, create it
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          role: 'customer', // default role
          createdAt: new Date()
        });
        console.log('New user created with role customer');
      } else {
        console.log('User already exists in Firestore');
      }
    }

    return result;
  }


  constructor(public globalService: GlobalService) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user){
        
        // this.globalService.setWhatAmIHead('user');
        // this.globalService.setWhatAmIDashboard('user');
        this.checkRole().then(() => {
          if(this.role == 'customer'){
            this.globalService.setWhatAmIHead('user');
            this.globalService.setWhatAmIDashboard('user');
          
          }else if(this.role == 'business'){
            this.globalService.setWhatAmIHead('store');
            this.globalService.setWhatAmIDashboard('store');
          }else{
            this.globalService.setWhatAmIHead('guest');
            this.globalService.setWhatAmIDashboard('guest');
        }
        });
      }else{
        this.globalService.setWhatAmIHead('guest');
        this.globalService.setWhatAmIDashboard('guest');
      }
    });
   }

  role = '';

  async checkRole(){
    const db = getFirestore();
    const user = this.currentUser;
    
    if(user){
      const uid = user.uid;
      const userRef = doc(db, 'users', uid);

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
    const userData = userSnap.data();
    this.role = userData['role']; // 👈 get specific field
    console.log('User role:', this.role);
  } else {
    console.log('User document not found.');
  }
    }
  }


}
