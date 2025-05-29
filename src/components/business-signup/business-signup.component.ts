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
    this.contactNumber = '';
    this.error = '';
    this.selectedLocation = '';
  }


//   async onRegister(): Promise<void> {
//     if (!this.fullname || !this.businessName || !this.email || !this.password || !this.confirmPassword || !this.businessAddress || !this.contactNumber) {
//       this.error = 'Please fill in all required fields.';
//       this.openModal();
//       return;
//     }
//   if (!this.logoFile) {
//     this.error = 'Please upload a logo.';
//     this.openModal();
//     return;
//   }

//   if (this.password !== this.confirmPassword) {
//     this.error = 'Passwords do not match.';
//     this.openModal();
//     return;
//   }

//   try {
//     // Step 1: Register user first
//     const auth = getAuth();
//     const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
//     const uid = userCredential.user.uid;

//     // Step 2: Upload logo after authentication
//     const filePath = `store_logos/${uid}/${uuidv4()}_${this.logoFile.name}`;
//     const fileRef = ref(this.storage, filePath);
//     await uploadBytes(fileRef, this.logoFile);
//     const logoUrl = await getDownloadURL(fileRef);

//     // Step 3: Save store data to 'stores' collection with document ID = uid
//     const storeDocRef = doc(this.firestore, 'users', uid);
//     await setDoc(storeDocRef, {
//       ownerId: uid,  // must be 'ownerId' to match rules
//       fullName: this.fullname,
//       businessName: this.businessName,
//       businessAddress: this.businessAddress,
//       contactNumber: this.contactNumber,
//       email: this.email,
//       logoUrl: logoUrl,
//       role: 'business',
//       createdAt: new Date(),
//     });

//     this.error = 'Store registered successfully!';
//     this.openModal();
//     this.clearfields();
//     this.router.navigate(['/dashboard']);
//   } catch (error) {
//     console.error('Error during registration:', error);
//     this.error = 'Something went wrong. Please try again.';
//     this.openModal();
//   }
// }

async onRegister(): Promise<void> {
  if (!this.fullname || !this.businessName || !this.email || !this.password || !this.confirmPassword || !this.businessAddress || !this.contactNumber) {
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
      businessAddress: this.businessAddress,
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
      storeAddress: this.businessAddress,
      logoUrl,
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

  
}
