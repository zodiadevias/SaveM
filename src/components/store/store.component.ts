import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
@Component({
  selector: 'app-store',
  imports: [HeaderComponent,CommonModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {
  showReviewModal = false;
  storeID: any;

  openReviewModal(event: MouseEvent) {
    event.preventDefault();
    this.showReviewModal = true;
  }

  constructor(private globalService: GlobalService) {
    
  }

  ngDoCheck() {
    this.storeID = this.globalService.getStoreID();
    
  }









}
