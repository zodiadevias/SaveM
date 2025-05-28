import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-menu',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './business-menu.component.html',
  styleUrl: './business-menu.component.css'
})
export class BusinessMenuComponent {

  showCheckboxes = false;

  toggleCheckboxes(): void {
    this.showCheckboxes = !this.showCheckboxes;
  }
}
