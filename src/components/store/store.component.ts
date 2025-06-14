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
      for (let i = 0; i< this.storeData.ratings.length; i++){
        totalRating += this.storeData.ratings[i];
      }
      this.overallRating = totalRating / this.storeData.ratings.length;
    });

    await this.firestoreService.getMenuItems(this.storeID).subscribe((items) => {
      this.items = items;
      console.log(this.items);
    });
  }











}
