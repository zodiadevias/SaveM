import { Component, AfterViewInit } from '@angular/core';
import {  ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsService } from '../../services/google-maps.service';

declare global {
  interface Window {
    initMap: () => void;
  }
}
@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  @Input() apiKey!: string;
  @Input() foodPlaces: { name: string; lat: number; lng: number }[] = [];
  @Input() mode: 'delivery' | 'pickup' = 'pickup';

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: google.maps.Map;
  private infoWindow!: google.maps.InfoWindow;
  private userLocation: google.maps.LatLngLiteral | null = null;

  // private riderLocation: google.maps.LatLngLiteral = {
  //   lat: 14.84193, lng: 120.28671
  // }

  ngOnInit(): void {
    this.loadGoogleMapsScript().then(() => this.initMap());
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('google-maps-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Google Maps script failed to load');
      document.head.appendChild(script);
    });
  }

  private initMap(): void {
    const defaultCenter = this.userLocation || { lat: 14.84193, lng: 120.28671 }; // my current location as fallback

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: defaultCenter,
      zoom: 13,
      mapTypeControl: false,
    });

    this.infoWindow = new google.maps.InfoWindow();

    this.setUserLocation().then((location) => {
      this.userLocation = location;
      this.map.setCenter(location);
      this.addUserMarker(location);
      // this.addRiderMarker();
      this.addFoodMarkers();

      if (this.mode === 'delivery') {
        this.drawDeliveryRoutes();
      }
    });
  }

  private setUserLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }),
          () => resolve({ lat: 40.7128, lng: -74.006 }) // fallback location
        );
      } else {
        resolve({ lat: 40.7128, lng: -74.006 });
      }
    });
  }

  private addUserMarker(position: google.maps.LatLngLiteral): void {
    new google.maps.Marker({
      position,
      map: this.map,
      title: 'You are here',
      icon: {
        url: 'https://img.icons8.com/emoji/48/house-emoji.png'
      }
    });
  }

//   private addRiderMarker(): void {
//   new google.maps.Marker({
//     position: this.riderLocation,
//     map: this.map,
//     title: 'Delivery Rider',
//     icon: {
//       url: 'https://img.icons8.com/emoji/48/motor-scooter.png', // or your own icon
//       scaledSize: new google.maps.Size(40, 40)
//     }
//   });
// }


  private addFoodMarkers(): void {
    for (const place of this.foodPlaces) {
      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: this.map,
        title: place.name,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        }
      });

      marker.addListener('click', () => {
        this.infoWindow.setContent(place.name);
        this.infoWindow.open(this.map, marker);
      });
    }
  }

  private drawDeliveryRoutes(): void {
    if (!this.userLocation) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map, suppressMarkers: true });

    const requests = this.foodPlaces.map(place => {
      return directionsService.route({
        origin: this.userLocation!,
        destination: { lat: place.lat, lng: place.lng },
        travelMode: google.maps.TravelMode.DRIVING
      });
    });

    // Only show the first route (or customize to show multiple)
    requests[0].then((result) => {
      directionsRenderer.setDirections(result);
    });
  }
}
