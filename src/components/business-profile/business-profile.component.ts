import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { MapPickerComponent } from '../../modal/map-picker/map-picker.component';
import { FirestoreService } from '../../services/firestore.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword ,deleteUser, signOut } from 'firebase/auth';
import { doc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [HeaderComponent, FormsModule, MapPickerComponent],
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.css'
})
export class BusinessProfileComponent implements OnInit {
  whatAmI = 'storeowner';

  businessName: any;
  lat: number | null = null;
  lng: number | null = null;
  userLocation: string = '';

  constructor(private firestoreService: FirestoreService, private auth: Auth, private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    this.authService.user$.subscribe(async user => {
      this.businessName = await this.firestoreService.getBusinessName(user?.uid || '');
          
          this.firestoreService.getUser(user?.uid || '').subscribe(user => {
            this.businessName = user.businessName || '';
            if (user.location?.lat && user.location?.lng) {
              this.lat = user.location.lat;
              this.lng = user.location.lng;
              this.userLocation = `${this.lat}, ${this.lng}`;
              
            }
          });
        }
    );
  }

  onLocationChosen(coords: string) {
    const [lat, lng] = coords.split(',').map(Number);
    this.lat = lat;
    this.lng = lng;
  }

  saveProfile() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      alert('User not logged in.');
      return;
    }

    if (!this.businessName.trim()) {
      alert('Business name is required.');
      return;
    }

    if (this.lat === null || this.lng === null) {
      alert('Please select a location.');
      return;
    }

    const updatedData = {
      businessName: this.businessName,
      location: {
        lat: this.lat,
        lng: this.lng,
      },
    };

    this.firestoreService.updateUserProfile(uid, updatedData)
      .then(() => alert('Profile updated successfully!'))
      .catch(err => {
        console.error(err);
        alert('Failed to update profile.');
      });
  }




  oldPassword: string = '';
newPassword: string = '';
confirmPassword: string = '';

async changePassword() {
  if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
    alert('All fields are required.');
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    alert('New passwords do not match.');
    return;
  }

  const user = this.auth.currentUser;
  if (!user || !user.email) {
    alert('User not authenticated.');
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, this.oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, this.newPassword);
    alert('Password changed successfully.');
    
    // Clear inputs
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  } catch (error: any) {
    console.error('Error changing password:', error);
    if (error.code === 'auth/wrong-password') {
      alert('Incorrect old password.');
    } else if (error.code === 'auth/weak-password') {
      alert('Password should be at least 6 characters.');
    } else {
      alert('Failed to change password.');
    }
  }
}



async deleteAccount() {
  const user = this.auth.currentUser;

  if (!user || !user.email) {
    alert('No authenticated user.');
    return;
  }

  const confirmation = confirm('Are you sure you want to delete your account? This action is irreversible.');
  if (!confirmation) return;

  const password = prompt('Please confirm your password to delete the account:');
  if (!password) return;

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    const uid = user.uid;

    // Delete store document
    const storeRef = doc(this.firestoreService.firestore, `stores/${uid}`);
    await deleteDoc(storeRef);

    // Delete user document
    const userRef = doc(this.firestoreService.firestore, `users/${uid}`);
    await deleteDoc(userRef);

    // Delete Firebase Auth user
    await deleteUser(user);

    // Log out the user after deletion
    await signOut(this.auth);

    alert('Account deleted and logged out successfully.');
    // Optionally redirect, e.g.
    this.router.navigate(['/dashboard']);

  } catch (error: any) {
    console.error('Delete error:', error);
    if (error.code === 'auth/wrong-password') {
      alert('Incorrect password.');
    } else {
      alert('Failed to delete account. You may need to reauthenticate.');
    }
  }
}


}
