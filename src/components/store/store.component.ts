import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-store',
  imports: [HeaderComponent,CommonModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent{
  showReviewModal = false;
  storeID: any;

  openReviewModal(event: MouseEvent) {
    event.preventDefault();
    this.showReviewModal = true;
  }

  constructor(
    private globalService: GlobalService, 
    private firestoreService: FirestoreService, 
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.storeID = params['id'];
    })
  }

  storeData: any;
  overallRating: number = 0;
  items: any;

  async ngOnInit(){
    // this.storeID = this.globalService.getStoreID();
    await this.firestoreService.getStore(this.storeID).subscribe(data => {
      this.storeData = data;
      console.log(this.storeData);
      let totalRating = 0;
      for (let i = 0; i < this.storeData.ratings.length; i++){
        totalRating += this.storeData.ratings[i];
      }
      this.overallRating = totalRating / this.storeData.ratings.length;
    });

    await this.firestoreService.getMenuItems(this.storeID).subscribe((items) => {
      this.items = items;
      
    });
  }




  cartItems: any;
  totalPrice: number = 0;

  addToCart(item: any) {
    if (this.cartItems === undefined || this.cartItems.length === 0) {
      this.cartItems = [item];
      this.cartItems[0].quantity = 1;
    } else {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i].id === item.id) {
          this.cartItems[i].quantity++;
        }else{
          this.cartItems.push(item);
          this.cartItems[this.cartItems.length - 1].quantity = 1;
        }
      }
      
    }

    this.totalPrice = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      this.totalPrice += this.cartItems[i].finalPrice * this.cartItems[i].quantity;
      
    }
  }

  removeFromCart(item: any) {
    
    if (item.quantity === 1) {
      this.cartItems.splice(this.cartItems.indexOf(item), 1);
      this.totalPrice = this.totalPrice - item.finalPrice;
    }else{
      item.quantity--;
      this.totalPrice = this.totalPrice - item.finalPrice;
    }
  }








}
