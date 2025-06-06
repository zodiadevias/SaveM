import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Output, ViewChild , Input} from '@angular/core';

@Component({
  selector: 'app-map-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.css'
})
export class MapPickerComponent {
  @Input() defaultLocation: string = ''; // Format: 'lat, lng'
  @Output() locationSelected = new EventEmitter<string>();
  @ViewChild('mapPicker', { static: false }) mapPickerRef!: ElementRef;

  selectedCoordinates = '';
  showMapModal = false;

  private mapPicker!: google.maps.Map;
  private pinMarker!: google.maps.Marker;

  openMapModal(): void {
    this.loadGoogleMapsScript()
      .then(() => {
        this.showMapModal = true;
        setTimeout(() => this.initPickerMap(), 200);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load Google Maps');
      });
  }

  closeMapModal(): void {
    this.showMapModal = false;
  }

  confirmLocation(): void {
    if (this.pinMarker) {
      const pos = this.pinMarker.getPosition();
      if (pos) {
        this.selectedCoordinates = `${pos.lat()}, ${pos.lng()}`;
        this.locationSelected.emit(this.selectedCoordinates);
      }
    }
    this.closeMapModal();
  }

  private initPickerMap(): void {
    let center = { lat: 0, lng: 0 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.mapPicker.setCenter(center);
          this.pinMarker.setPosition(center);
        },
        () => {
          console.error('Error: Unable to retrieve your location');
        }
      );
    } else {
      console.error("Error: Geolocation is not supported by this browser.");
    }

    // Use defaultLocation if available
    if (this.defaultLocation) {
      const [lat, lng] = this.defaultLocation.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        center = { lat, lng };
      }
    }

    this.mapPicker = new google.maps.Map(this.mapPickerRef.nativeElement, {
      center,
      zoom: 13,
    });

    // Set pin if default location exists
    this.pinMarker = new google.maps.Marker({
      position: center,
      map: this.mapPicker,
      draggable: true,
    });

    this.mapPicker.addListener('click', (e: google.maps.MapMouseEvent) => {
      const clickedLocation = e.latLng!;
      this.pinMarker.setPosition(clickedLocation);
    });
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
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

}
