import { Component, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
 @ViewChild('map', { static: true }) mapElement!: ElementRef;

  constructor(private googleMapsService: GoogleMapsService) {}

  ngAfterViewInit(): void {
    window.initMap = () => this.googleMapsService.initMap(this.mapElement.nativeElement);
    this.googleMapsService.loadGoogleMaps('AIzaSyAfeFxRviL6S-qG7OkcmvKG_THCdk_zjNM'); // replace with your real API key
  }
}
