import { Component, inject, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc , doc, setDoc} from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificationModalComponent } from '../../modal/notification-modal/notification-modal.component';

@Component({
  selector: 'app-business-signup',
  imports: [HeaderComponent, CommonModule, FormsModule, HttpClientModule, NotificationModalComponent],
  templateUrl: './business-signup.component.html',
  styleUrl: './business-signup.component.css'
})
export class BusinessSignupComponent implements OnInit{

  isModalOpen = false;
  isVisible = false;


  openModal(): void {
  this.isModalOpen = true;
  this.isVisible = false;
  }

  closeModal() {
  this.isModalOpen = false;
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

  ngOnInit(): void {
    this.fetchLocations();
  }

  selectedLocation: string = '';
  httpClient = inject(HttpClient);
  firestore = inject(Firestore);
  storage = inject(Storage);
  auth = inject(AuthService);
  router = inject(Router);
  locations: any = [];

  fetchLocations() {
    this.httpClient.get('https://psgc.gitlab.io/api/provinces/').subscribe(data => {
      console.log(data);
      this.locations = data;
    });
  }


  fullname = '';
  businessName = '';
  businessAddress = '';
  businessCity: any = '';
  contactNumber = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';

  


  clearfields(){
    this.fullname = '';
    this.businessName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.businessAddress = '';
    this.businessCity = '';
    this.contactNumber = '';
    this.error = '';
    this.selectedLocation = '';
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


async onRegister(): Promise<void> {
  if (!this.fullname || !this.businessName || !this.email || !this.password || !this.confirmPassword || !this.selectedCoordinates || !this.contactNumber) {
    this.error = 'Please fill in all required fields.';
    this.openModal();
    return;
  }

  if (!this.logoFile) {
    this.error = 'Please upload a logo.';
    this.openModal();
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.error = 'Passwords do not match.';
    this.openModal();
    return;
  }

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
    const uid = userCredential.user.uid;

    const [latitude, longitude] = this.selectedCoordinates.split(',').map(coord => parseFloat(coord.trim()));

    // Upload store logo
    const filePath = `store_logos/${uid}/${uuidv4()}_${this.logoFile.name}`;
    const fileRef = ref(this.storage, filePath);
    await uploadBytes(fileRef, this.logoFile);
    const logoUrl = await getDownloadURL(fileRef);

    // Save user data to 'users' collection
    const userDocRef = doc(this.firestore, 'users', uid);
    await setDoc(userDocRef, {
      uid,
      fullName: this.fullname,
      businessName: this.businessName,
      businessAddress: {
        lat: latitude,
        lng: longitude
      },
      businessCity: this.businessCity,
      contactNumber: this.contactNumber,
      email: this.email,
      logoUrl,
      role: 'business',
      createdAt: new Date(),
    });

    // Save store data to 'stores' collection (same uid as the user)
    const storeDocRef = doc(this.firestore, 'stores', uid);
    await setDoc(storeDocRef, {
      ownerId: uid,
      storeName: this.businessName,
      storeAddress: {
        lat: latitude,
        lng: longitude
      },
      businessCity: this.businessCity,
      logoUrl,
      rating: 0,
      createdAt: new Date(),
    });

    // Optional: Add default product as example (or skip this)
    // const productRef = collection(this.firestore, `stores/${uid}/products`);
    // await addDoc(productRef, {
    //   name: 'Sample Product',
    //   stock: 0,
    //   description: '',
    //   originalPrice: 0,
    //   discount: 0,
    //   finalPrice: 0,
    //   createdAt: new Date(),
    // });

    this.error = 'Store registered successfully!';
    this.openModal();
    this.clearfields();
    this.router.navigate(['/dashboard']);

  } catch (error) {
    console.error('Error during registration:', error);
    this.error = 'Something went wrong. Please try again.';
    this.openModal();
  }
}


                                                                      //MAP PICKER
@ViewChild('mapPicker', { static: false }) mapPickerRef!: ElementRef;

selectedCoordinates = '';
showMapModal = false;

private mapPicker!: google.maps.Map;
private pinMarker!: google.maps.Marker;

openMapModal(): void {
  this.loadGoogleMapsScript()
    .then(() => {
      this.showMapModal = true;
      setTimeout(() => {
        const coords = this.selectedCoordinates?.split(',').map(x => parseFloat(x.trim()));
        const center = coords?.length === 2
          ? { lat: coords[0], lng: coords[1] }
          : { lat: 14.84193, lng: 120.28671 };

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

  // If editing, place marker
  if (this.selectedCoordinates) {
    const [lat, lng] = this.selectedCoordinates.split(',').map(x => parseFloat(x.trim()));
    this.pinMarker = new google.maps.Marker({
      position: { lat, lng },
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
    } else {
      this.pinMarker.setPosition(clickedLocation);
    }
  });
}
//MAP PICKER


  
}
