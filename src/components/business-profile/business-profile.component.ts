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
import { NotificationModalComponent } from '../../modal/notification-modal/notification-modal.component';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [HeaderComponent, FormsModule, MapPickerComponent, NotificationModalComponent],
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

  async getCityFromCoordinates(lat: number, lng: number): Promise<string | null> {
    const apiKey = 'AIzaSyAfeFxRviL6S-qG7OkcmvKG_THCdk_zjNM';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const addressComponents = data.results[0].address_components;
        const cityComponent = addressComponents.find((comp: any) =>
          comp.types.includes('locality')
        );
        return cityComponent ? cityComponent.long_name : null;
      } else {
        console.error('Geocoding API error:', data.status);
        return null;
      }
    } catch (err) {
      console.error('Error fetching city:', err);
      return null;
    }
}

  onLocationChosen(coords: string) {
    const [lat, lng] = coords.split(',').map(Number);
    this.lat = lat;
    this.lng = lng;
  }

  saveProfile() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      this.notif = 'User not logged in.';
      this.openModal();
      return;
    }

    if (!this.businessName.trim()) {
      this.notif = 'Business name is required.';
      this.openModal();
      return;
    }

    if (this.lat === null || this.lng === null) {
      this.notif = 'Please select a location.';
      this.openModal();
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
      .then(() => {
        this.notif = 'Profile updated.';
        this.openModal();
      })
      .catch(err => {
        console.error(err);
        this.notif = 'Failed to update profile.';
        this.openModal();
      });
  }




  oldPassword: string = '';
newPassword: string = '';
confirmPassword: string = '';

isModalOpen = false;
  isVisible = false;


  openModal(): void {
  this.isModalOpen = true;
  this.isVisible = false;
  }

  closeModal() {
  this.isModalOpen = false;
}
notif = '';
async changePassword() {
  if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
    this.notif = 'Please fill in all fields.';
    this.openModal();
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.notif = 'New password and confirm password do not match.';
    this.openModal();
    return;
  }

  const user = this.auth.currentUser;
  if (!user || !user.email) {
    this.notif = 'User not logged in.';
    this.openModal();
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, this.oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, this.newPassword);
    this.notif = 'Password changed successfully.';
    this.openModal();
    
    // Clear inputs
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  } catch (error: any) {
    console.error('Error changing password:', error);
    if (error.code === 'auth/wrong-password') {
      this.notif = 'Incorrect old password.';
      this.openModal();
    } else if (error.code === 'auth/weak-password') {
      this.notif = 'Password is too weak.';
      this.openModal();
    } else {
      this.notif = 'Failed to change password.';
      this.openModal();
    }
  }
}



async deleteAccount() {
  const user = this.auth.currentUser;

  if (!user || !user.email) {
    this.notif = 'No user logged in.';
    this.openModal();
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

    this.notif = 'Account deleted successfully.';
    this.openModal();
    // Optionally redirect, e.g.
    this.router.navigate(['/dashboard']);

  } catch (error: any) {
    console.error('Delete error:', error);
    if (error.code === 'auth/wrong-password') {
      this.notif = 'Incorrect password.';
      this.openModal();
    } else {
      this.notif = 'Failed to delete account.';
      this.openModal();
    }
  }
}


}
