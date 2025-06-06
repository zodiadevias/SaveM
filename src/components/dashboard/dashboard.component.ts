import { Component , HostListener, OnInit} from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal/modal.component';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { UserdataService } from '../../services/userdata.service';
import { Store } from '../../models/store.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  screenWidth: number = window.innerWidth;

  isModalOpen: boolean = false;
  isVisible: boolean = false;


  name : any = '';
  public chart: any;
  whatAmI = '';
  stores: Store[] = [];
  lat = 0;
  lng = 0;
  city: any = '';



  constructor(private globalService: GlobalService, public authService: AuthService, public firestoreService: FirestoreService, private userdataService: UserdataService) {
    // this.globalService.setWhatAmIHead('guest');
    
  }


  async getUserData() {
    return await this.userdataService.getUserData();
  }
  

openModal(whatAmI: string): void {
  this.globalService.setWhatAmI(whatAmI);
  this.isModalOpen = true;
  this.isVisible = false;
}

checkUser() {
  if (!this.authService.currentUser) {
    this.openModal('guest');
  }
}

closeModal() {
  this.isModalOpen = false;
}

  async ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.authService.user$.subscribe(async user => {
      this.name = await this.firestoreService.getBusinessName(user?.uid || '');
      
    });

    this.firestoreService.getAllStores().subscribe((stores) => {
    this.stores = stores;
    console.log(this.stores);
  });

  this.getCurrentCoordinates()
    .then(coords => {
      this.lat = coords.lat;
      this.lng = coords.lng;
      this.city = this.getCityFromCoordinates(this.lat, this.lng);
      // Optional: Call geocoding here to get city
    })
    .catch(err => {
      console.error(err);
    });

    
    
  }

  ngDoCheck() {
    this.whatAmI = this.globalService.getWhatAmIDashboard();
    
  }
  
  


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }


  getCurrentCoordinates(): Promise<{ lat: number, lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not supported');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject('Failed to get location: ' + error.message);
      }
    );
  });
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





  


}
