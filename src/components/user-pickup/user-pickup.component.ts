import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-user-pickup',
  imports: [HeaderComponent, MapComponent],
  templateUrl: './user-pickup.component.html',
  styleUrl: './user-pickup.component.css'
})
export class UserPickupComponent {
  order: string = 'Banana Bread';
  status: string = 'Pending';

  foodPlaces: { name: string; lat: number; lng: number }[] = [{ name: 'Tinapayan', lat: 14.84193, lng: 120.28671 }]
}
