import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
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
  private userLiveMarker!: google.maps.Marker;

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
    const defaultCenter = this.userLocation || { lat: 14.84193, lng: 120.28671 };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: defaultCenter,
      zoom: 13,
      mapTypeControl: false,
    });

    this.infoWindow = new google.maps.InfoWindow();

    this.startRealtimeUserTracking().then((location) => {
      this.userLocation = location;
      this.map.setCenter(location);
      this.addFoodMarkers();

      if (this.mode === 'delivery') {
        this.drawDeliveryRoutes();
      }
    });
  }

  private startRealtimeUserTracking(): Promise<google.maps.LatLngLiteral> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (pos) => {
            const coords: google.maps.LatLngLiteral = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };

            this.userLocation = coords;
            this.updateUserLiveMarker(coords);

            resolve(coords); // First update only
          },
          () => {
            const fallback = { lat: 40.7128, lng: -74.006 };
            this.updateUserLiveMarker(fallback);
            resolve(fallback);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
          }
        );
      } else {
        const fallback = { lat: 40.7128, lng: -74.006 };
        this.updateUserLiveMarker(fallback);
        resolve(fallback);
      }
    });
  }

  private updateUserLiveMarker(position: google.maps.LatLngLiteral): void {
    if (!this.userLiveMarker) {
      this.userLiveMarker = new google.maps.Marker({
        position,
        map: this.map,
        title: 'You (Live)',
        icon: {
          url: 'https://img.icons8.com/emoji/48/house-emoji.png',
          scaledSize: new google.maps.Size(40, 40)
        }
      });
    } else {
      this.userLiveMarker.setPosition(position);
    }

    this.map.setCenter(position); // Optional: follow user
  }

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

    requests[0].then((result) => {
      directionsRenderer.setDirections(result);
    });
  }
}
