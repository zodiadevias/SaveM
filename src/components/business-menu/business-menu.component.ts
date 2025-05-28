import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { BusinessMenuModalComponent } from "../../modal/business-menu-modal/business-menu-modal.component";

@Component({
  selector: 'app-business-menu',
  imports: [HeaderComponent, CommonModule, BusinessMenuModalComponent],
  templateUrl: './business-menu.component.html',
  styleUrl: './business-menu.component.css'
})
export class BusinessMenuComponent {

  items :string[] = ['banana', 'apple', 'orange', 'grape', 'pear'];


  isModalOpen: boolean = false;
  isVisible: boolean = false;


  openModal(): void {
  this.isModalOpen = true;
  this.isVisible = false;
  }

closeModal() {
  this.isModalOpen = false;
}

  showCheckboxes = false;

  toggleCheckboxes(): void {
    this.showCheckboxes = !this.showCheckboxes;
  }
}
