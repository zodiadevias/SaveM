import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword ,deleteUser, signOut } from 'firebase/auth';
import { doc, deleteDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NotificationModalComponent } from '../../modal/notification-modal/notification-modal.component';
import { UserdataService } from '../../services/userdata.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [HeaderComponent, FormsModule, NotificationModalComponent, CommonModule],
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.css'
})
export class BusinessProfileComponent  implements OnInit{
  
  constructor(private firestoreService: FirestoreService, private userdataService: UserdataService, private authService: AuthService, private auth: Auth, private storage: Storage) {}

  userData: any;
  businessName: any = '';
  businessEmail: any = '';
  businessPhone: any = '';
  businessAddress: any = {};
  businessCity: any = '';
  businessLogo: any = '';
  businessOwner: any = '';
  

  async getUserData() {
    return await this.userdataService.getUserData();
  }


  private userSub!: Subscription;
  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(async user => {
      if (user) {
        this.getUserData().then(userData => {
          this.userData = userData;
          // initialize the form with the user data here
          this.businessAddress = userData.businessAddress;
          this.businessName = userData.businessName;
          this.businessEmail = userData.email;
          this.businessPhone = userData.contactNumber;
          this.businessCity = userData.businessCity;
          this.businessLogo = userData.logoUrl;
          this.businessOwner = userData.fullName;
          //initialize the image
          this.logoPreview = this.businessLogo;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
onBoxClick(): void {
    this.fileInput.nativeElement.click();
}

logoFile: File | null = null;
logoPreview: string | null = null;
onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logoFile = input.files[0];
      this.logoPreview = URL.createObjectURL(this.logoFile);
    }
  }





                                                                        //MAP PICKER
@ViewChild('mapPicker', { static: false }) mapPickerRef!: ElementRef;

selectedCoordinates = '';
showMapModal = false;

private mapPicker!: google.maps.Map;
private pinMarker!: google.maps.Marker;

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

openMapModal(): void {
  this.loadGoogleMapsScript()
    .then(() => {
      this.showMapModal = true;
      setTimeout(() => {
        const coords = this.businessAddress;
        console.log(coords);
        console.log(coords.lat);
        console.log(coords.lng);
        const center = coords
          ? { lat: coords.lat, lng: coords.lng }
          : { lat: 0, lng: 0 };

        this.initPickerMap(center);
      }, 200);
    })
    .catch((err) => {
      console.error(err);
      alert('Failed to load Google Maps');
    });
}


closeMapModal(): void {
  this.showMapModal = false;
}

async confirmLocation() {
  if (this.pinMarker) {
    const pos = this.pinMarker.getPosition();
    if (pos) {
      this.selectedCoordinates = `${pos.lat()}, ${pos.lng()}`;
      this.businessCity = await this.getCityFromCoordinates(pos.lat(), pos.lng());
      console.log(this.businessCity);
    }
  }
  this.closeMapModal();
}

private loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve(); // Already loaded
      return;
    }

    if (document.getElementById('google-maps-script')) {
      (window as any).onGoogleMapsReady = () => resolve();
      return;
    }

    (window as any).onGoogleMapsReady = () => resolve();

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAfeFxRviL6S-qG7OkcmvKG_THCdk_zjNM&callback=onGoogleMapsReady`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject('Google Maps failed to load.');
    document.head.appendChild(script);
  });
}

private initPickerMap(center: google.maps.LatLngLiteral): void {
  this.mapPicker = new google.maps.Map(this.mapPickerRef.nativeElement, {
    center,
    zoom: 13,
  });


   if (center.lat !== 0 || center.lng !== 0) {
    this.pinMarker = new google.maps.Marker({
      position: center,
      map: this.mapPicker,
      draggable: true
    });
  }

  this.mapPicker.addListener('click', (e: google.maps.MapMouseEvent) => {
    const clickedLocation = e.latLng!;
    if (!this.pinMarker) {
      this.pinMarker = new google.maps.Marker({
        position: clickedLocation,
        map: this.mapPicker,
        draggable: true
      });
    }
    else {
      this.pinMarker.setPosition(clickedLocation);
    }
  });
}
//MAP PICKER



btnChangePassword = 'Change Password';
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
  this.btnChangePassword = 'Processing..';
  if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
    this.notif = 'Please fill in all fields.';
    this.openModal();
    this.btnChangePassword = 'Change Password';
    return;
  }

  if (this.newPassword !== this.confirmPassword) {
    this.notif = 'New password and confirm password do not match.';
    this.openModal();
    this.btnChangePassword = 'Change Password';
    return;
  }

  const user = this.auth.currentUser;
  if (!user || !user.email) {
    this.notif = 'User not logged in.';
    this.openModal();
    this.btnChangePassword = 'Change Password';
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
    this.btnChangePassword = 'Change Password';
  } catch (error: any) {
    console.error('Error changing password:', error);
    if (error.code === 'auth/wrong-password') {
      this.notif = 'Incorrect old password.';
      this.openModal();
      this.btnChangePassword = 'Change Password';
    } else if (error.code === 'auth/weak-password') {
      this.notif = 'Password is too weak.';
      this.openModal();
      this.btnChangePassword = 'Change Password';
    } else {
      this.notif = 'Failed to change password.';
      this.openModal();
      this.btnChangePassword = 'Change Password';
    }
  }
}

btnUpdate = 'Update';
passwordValidation = '';

async saveProfile() {
    this.btnUpdate = 'Processing..';

    const user = this.auth.currentUser;
    if (!user || !user.email) {
      this.notif = 'User not logged in.';
      this.openModal();
      return;
    }
    try{
      const credential = EmailAuthProvider.credential(user.email, this.passwordValidation);
      await reauthenticateWithCredential(user, credential);
      const uid = this.auth.currentUser?.uid;
      if (!uid) {
        this.notif = 'User not logged in.';
        this.openModal();
        this.btnUpdate = 'Update';
        return;
      }

      const filePath = `store_logos/${uid}/${uuidv4()}_${this.logoFile?.name}`;
      const fileRef = ref(this.storage, filePath);
      let logoUrl;
      if (this.logoFile) {
      // Delete old logo if exists
      if (this.businessLogo) {
        try {
          const oldRef = ref(this.storage, this.businessLogo);
          await deleteObject(oldRef);
          console.log('Old logo deleted successfully');
        } catch (err) {
          console.warn('Failed to delete old logo (might not exist):', err);
        }
      }

      // Upload new logo
      const filePath = `store_logos/${uid}/${uuidv4()}_${this.logoFile.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, this.logoFile);
      logoUrl = await getDownloadURL(fileRef);
    }else{
      logoUrl = this.businessLogo
    }
      
      

      let lat: number | null = null;
      let lng: number | null = null;
      if (this.selectedCoordinates) {
        const coords = this.selectedCoordinates.split(',');
        lat = Number.parseFloat(coords[0]);
        lng = Number.parseFloat(coords[1]);
      }else{
        lat = this.businessAddress?.lat;
        lng = this.businessAddress?.lng;
      }

      const updatedDataUser = {
        businessName: this.businessName,
        businessAddress: {
          lat: lat,
          lng: lng,
        },
        businessCity: this.businessCity,
        contactNumber: this.businessPhone,
        email: this.businessEmail,
        fullName: this.businessOwner,
        logoUrl: logoUrl,

      };

      const updatedDataStore = {
        businessCity: this.businessCity,
        logoUrl: logoUrl,
        storeAddress: {
          lat: lat,
          lng: lng
        },
        storeName: this.businessName,
      }

      try {
          const credential = EmailAuthProvider.credential(user.email, this.passwordValidation);
          await reauthenticateWithCredential(user, credential);

          await this.authService.updateEmail(this.businessEmail);

          await this.firestoreService.updateUserProfile(uid, updatedDataUser);
          await this.firestoreService.updateStoreProfile(uid, updatedDataStore);

          this.notif = 'Profile and email updated successfully.';
          this.openModal();
          this.btnUpdate = 'Update';

        } catch (error: any) {
          console.error('Error:', error);
          if (error.code === 'auth/wrong-password') {
            this.notif = 'Incorrect password.';
          } else if (error.code === 'auth/email-already-in-use') {
            this.notif = 'Email already in use.';
          } else if (error.code === 'auth/invalid-email') {
            this.notif = 'Invalid email format.';
          } else if (error.code === 'auth/requires-recent-login') {
            this.notif = 'Please log in again to change email.';
          } else {
            this.notif = 'Failed to update profile.';
          }
          this.openModal();
          this.btnUpdate = 'Update';
  }

    
      this.openModal();
      this.btnUpdate = 'Update';


    }catch(error: any){
      this.notif = 'Incorrect password.';
      this.openModal();
      this.btnUpdate = 'Update';
      return;
    }

    
    

    


    }


    
    





}
