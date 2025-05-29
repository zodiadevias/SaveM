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
  
}
