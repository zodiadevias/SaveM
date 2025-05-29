import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { BusinessMenuModalComponent } from "../../modal/business-menu-modal/business-menu-modal.component";
import { BusinessMenuEditModalComponent } from "../../modal/business-menu-edit-modal/business-menu-edit-modal.component";
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-business-menu',
  imports: [HeaderComponent, CommonModule, BusinessMenuModalComponent, BusinessMenuEditModalComponent, BusinessMenuEditModalComponent],
  templateUrl: './business-menu.component.html',
  styleUrl: './business-menu.component.css'
})
export class BusinessMenuComponent {

  
items: MenuItem[] = [
  {id: '1', name: 'Banana Bread', description: 'Delicious banana bread', stock: 10, price: 50, discount: 20, finalPrice: 40, imageUrl: 'img/logo.png', isAvailable: true},
  {id: '2', name: 'Chocolate Cake', description: 'Delicious chocolate cake', stock: 5, price: 100, discount: 10, finalPrice: 90, imageUrl: 'img/logo.png', isAvailable: true},
  {id: '3', name: 'Cinnamon Roll', description: 'Delicious cinnamon roll', stock: 15, price: 25, discount: 15, finalPrice: 20, imageUrl: 'img/logo.png', isAvailable: true},
  {id: '4', name: 'Muffin', description: 'Delicious muffin', stock: 8, price: 30, discount: 5, finalPrice: 25, imageUrl: 'img/logo.png', isAvailable: true},
  {id: '5', name: 'Donut', description: 'Delicious donut', stock: 12, price: 15, discount: 0, finalPrice: 15, imageUrl: 'img/logo.png', isAvailable: true}
];



  isModalOpen: boolean = false;
  isVisible: boolean = false;
  isEditModalOpen: boolean = false;
  isEditVisible: boolean = false;
  showDelete : boolean = false;


  openModal(): void {
  this.isModalOpen = true;
  this.isVisible = false;
  }


  id: string = '';
  name: string = '';
  description: string = '';
  stock: number = 0;
  price: number = 0;
  discount: number = 0;
  finalPrice: number = 0;
  imageUrl: string = '';
  isAvailable: boolean = false;

  openEditModal(id: string, name: string, description: string, stock: number, price: number, discount: number, finalPrice: number, imageUrl: string, isAvailable: boolean): void {
    this.id = id;
    this.name = name;
    this.description = description;
    this.stock = stock;
    this.price = price;
    this.discount = discount;
    this.finalPrice = finalPrice;
    this.imageUrl = imageUrl;
    this.isAvailable = isAvailable;
    
    this.isEditModalOpen = true;
    this.isEditVisible = false;
    }

closeModal() {
  this.isModalOpen = false;
}

closeEditModal() {
  this.isEditModalOpen = false;
}


toggleShowDelete(){
  if(this.showDelete == true){
    this.selectedForDelete.clear();
  }
  this.showDelete = !this.showDelete;
}


selectedForDelete: Set<number> = new Set();

toggleDeleteSelection(index: number): void {
  if (this.selectedForDelete.has(index)) {
    this.selectedForDelete.delete(index);
  } else {
    this.selectedForDelete.add(index);
  }
}

deleteSelected(): void {
  this.items = this.items.filter((_, index) => !this.selectedForDelete.has(index));
  this.selectedForDelete.clear();
  this.showDelete = false;
}
  
}
