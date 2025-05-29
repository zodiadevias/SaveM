import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-user-delivery',
  imports: [HeaderComponent, MapComponent],
  templateUrl: './user-delivery.component.html',
  styleUrl: './user-delivery.component.css'
})
export class UserDeliveryComponent {
  foodPlaces: { name: string; lat: number; lng: number }[] = [
    { name: 'Tinapayan', lat: 14.84193, lng: 120.28671 }
  ]
}
