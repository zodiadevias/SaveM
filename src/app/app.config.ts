import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


const firebaseConfig = {
  apiKey: "AIzaSyAcJrNYQh39fScVhn6jWJSv5GHjLgdX87g",
  authDomain: "savemunch-9cd09.firebaseapp.com",
  projectId: "savemunch-9cd09",
  storageBucket: "savemunch-9cd09.firebasestorage.app",
  messagingSenderId: "9541239258",
  appId: "1:9541239258:web:61d0f66babba9668e600e3",
  measurementId: "G-4WQHFMC38Q"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};