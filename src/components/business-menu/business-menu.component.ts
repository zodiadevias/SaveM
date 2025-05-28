import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { BusinessMenuModalComponent } from "../../modal/business-menu-modal/business-menu-modal.component";
import { BusinessMenuEditModalComponent } from "../../modal/business-menu-edit-modal/business-menu-edit-modal.component";

@Component({
  selector: 'app-business-menu',
  imports: [HeaderComponent, CommonModule, BusinessMenuModalComponent, BusinessMenuEditModalComponent, BusinessMenuEditModalComponent],
  templateUrl: './business-menu.component.html',
  styleUrl: './business-menu.component.css'
})
export class BusinessMenuComponent {

  items :string[] = ['banana', 'apple', 'orange', 'grape', 'pear'];


  isModalOpen: boolean = false;
  isVisible: boolean = false;
  isEditModalOpen: boolean = false;
  isEditVisible: boolean = false;

  showDelete : boolean = false;


  openModal(): void {
  this.isModalOpen = true;
  this.isVisible = false;
  }

  openEditModal(): void {
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
  
}
