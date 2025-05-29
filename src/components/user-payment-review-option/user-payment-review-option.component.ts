import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-user-payment-review-option',
  imports: [HeaderComponent],
  templateUrl: './user-payment-review-option.component.html',
  styleUrl: './user-payment-review-option.component.css'
})
export class UserPaymentReviewOptionComponent {
  address: string = 'tapat ng ricos';
  name: string = 'Jeff pogi';
  email: string = 'jeffpogi@gmail.com';
  phone: string = 't1234567891011';
  option: string = 'Delivery at';
  shopName: string = 'Tinapayan';
  shopAddress: string = 'tapat ng ricos';
  quantity: number = 1;
  product: string = 'Burger';
  price: number = 20;
  subtotal: number = 20;
  total: number = 20;
}
