import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule, formatCurrency } from '@angular/common';

@Component({
  selector: 'app-business-reviews',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './business-reviews.component.html',
  styleUrl: './business-reviews.component.css'
})
export class BusinessReviewsComponent {

}
