import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { BusinessMenuModalComponent } from "../../modal/business-menu-modal/business-menu-modal.component";
import { BusinessMenuEditModalComponent } from "../../modal/business-menu-edit-modal/business-menu-edit-modal.component";
import { MenuItem } from '../../models/menu-item.model';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


@Component({
  selector: 'app-business-menu',
  standalone: true,
  imports: [HeaderComponent, CommonModule, BusinessMenuModalComponent, BusinessMenuEditModalComponent],
  templateUrl: './business-menu.component.html',
  styleUrl: './business-menu.component.css'
})
export class BusinessMenuComponent implements OnInit {

  router = inject(Router);
  constructor(private firestoreService: FirestoreService, private authService: AuthService) {}

  items: MenuItem[] = [];

  isModalOpen: boolean = false; // Add new item modal
  isEditModalOpen: boolean = false; // Edit item modal
  showDelete: boolean = false;
  selectedForDelete: Set<number> = new Set();
  storeId: string = '';

  selectedItem: MenuItem | null = null; // Currently editing item

  async ngOnInit(): Promise<void> {
    const user = await this.authService.currentUser;
    if (user) {
      this.storeId = user.uid;
      this.loadItems();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  async loadItems() {
    if (!this.storeId) return;

    this.firestoreService.getMenuItems(this.storeId).subscribe((items) => {
      this.items = items;
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  async handleSaveProduct(product: any) {
    const user = await this.authService.currentUser;
    if (!user) return;

    const productWithOwner = {
      ...product,
      ownerId: user.uid,
    };

    await this.firestoreService.addMenuItem(this.storeId, productWithOwner);
    this.closeModal();
  }

  // Open edit modal and set the selected item
  openEditModal(item: MenuItem): void {
    this.selectedItem = item;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedItem = null;
  }

  async uploadImageToStorage(itemId: string, file: File): Promise<string> {
  const storage = getStorage(); // Gets default Firebase app storage
  const storageRef = ref(storage, `menu-items/${itemId}/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}


  // Handle saving the updated item from the edit modal
  async handleEditSave(data: any) {
  if (!this.storeId) return;

  const updatePayload: Record<string, any> = {
  name: data.name,
  description: data.description,
  stock: data.stock,
  price: data.price,
  discount: data.discount,
  finalPrice: data.finalPrice,
  isAvailable: data.isAvailable,
};


  try {
    // If image file is uploaded, you need to upload to Firebase Storage first and get URL
    if (data.imageFile) {
      const imageUrl = await this.uploadImageToStorage(data.id, data.imageFile);
      updatePayload['imageUrl'] = imageUrl;
    }

    await this.firestoreService.updateMenuItem(this.storeId, data.id, updatePayload);
    this.isEditModalOpen = false;
    this.loadItems(); // refresh your list
  } catch (error) {
    console.error('Error updating item:', error);
  }
}


  async handleDeleteProduct(itemId: string) {
  if (!this.storeId) return;

  try {
    await this.firestoreService.deleteMenuItem(this.storeId, itemId);
    // Optionally refresh your items list after deletion
    this.loadItems();

    // Close edit modal after deletion
    this.isEditModalOpen = false;
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}


  toggleShowDelete(): void {
    if (this.showDelete) {
      this.selectedForDelete.clear();
    }
    this.showDelete = !this.showDelete;
  }

  toggleDeleteSelection(index: number): void {
    if (this.selectedForDelete.has(index)) {
      this.selectedForDelete.delete(index);
    } else {
      this.selectedForDelete.add(index);
    }
  }

  deleteSelected(): void {
    const itemsToDelete = Array.from(this.selectedForDelete);
    for (const index of itemsToDelete) {
      const item = this.items[index];
      this.firestoreService.deleteMenuItem(this.storeId, item.id ?? '');
    }

    this.items = this.items.filter((_, index) => !this.selectedForDelete.has(index));
    this.selectedForDelete.clear();
    this.showDelete = false;
  }
}
