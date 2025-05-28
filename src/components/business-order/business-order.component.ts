import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-order',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './business-order.component.html',
  styleUrl: './business-order.component.css'
})
export class BusinessOrderComponent {

   orderStates: { [key: number]: boolean } = {};

  toggleOrder(item: number): void {
    this.orderStates[item] = !this.orderStates[item];
  }

  isOrderOpen(item: number): boolean {
    return this.orderStates[item] ?? false;
  }
}
