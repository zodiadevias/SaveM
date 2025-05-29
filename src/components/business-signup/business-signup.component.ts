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

@Component({
  selector: 'app-business-signup',
  imports: [HeaderComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './business-signup.component.html',
  styleUrl: './business-signup.component.css'
})
export class BusinessSignupComponent implements OnInit{


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


  async onRegister(): Promise<void> {
    if (!this.fullname || !this.businessName || !this.email || !this.password || !this.confirmPassword || !this.businessAddress || !this.contactNumber) {
      alert('Please fill in all fields.');
      return;
    }
  if (!this.logoFile) {
    alert('Please upload a logo image.');
    return;
  }

  if (this.password !== this.confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    // Step 1: Register user first
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
    const uid = userCredential.user.uid;

    // Step 2: Upload logo after authentication
    const filePath = `store_logos/${uid}/${uuidv4()}_${this.logoFile.name}`;
    const fileRef = ref(this.storage, filePath);
    await uploadBytes(fileRef, this.logoFile);
    const logoUrl = await getDownloadURL(fileRef);

    // Step 3: Save store data to 'stores' collection with document ID = uid
    const storeDocRef = doc(this.firestore, 'users', uid);
    await setDoc(storeDocRef, {
      ownerId: uid,  // must be 'ownerId' to match rules
      fullName: this.fullname,
      businessName: this.businessName,
      businessAddress: this.businessAddress,
      contactNumber: this.contactNumber,
      email: this.email,
      logoUrl: logoUrl,
      role: 'business',
      createdAt: new Date(),
    });

    alert('Store registered successfully!');
    this.clearfields();
    this.router.navigate(['/dashboard']);
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred. Please try again.');
  }
}
  
}
