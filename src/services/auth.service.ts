import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from '@angular/fire/auth';
import { signInWithPopup, GoogleAuthProvider} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { GlobalService } from './global.service';

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

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  constructor(private globalService: GlobalService) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user){
        this.globalService.setWhatAmIHead('user');
      }else{
        this.globalService.setWhatAmIHead('guest');
      }
    });
   }

}
