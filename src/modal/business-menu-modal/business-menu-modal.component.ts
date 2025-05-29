import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-menu-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-menu-modal.component.html',
  styleUrl: './business-menu-modal.component.css'
})
export class BusinessMenuModalComponent {
  name: string = '';
  description: string = '';
  stock: number = 0;
  price: number = 0;
  discount: number = 0;
  finalPrice: number = 0;
  imageUrl: string | null = null;

  toggleEditDesc: any;
  toggleEdit: any;
  toggleEditName: boolean = false;
  toggleEditDescription: boolean = false;
  toggleStock: boolean = false;
  togglePrice: boolean = false;
  toggleDiscount: boolean = false;
  toggleConfirmation: boolean = false;

  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveProduct = new EventEmitter<any>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  close(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  onBoxClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        this.imageUrl = (e.target as FileReader).result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  enforceLineLimit(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lines = textarea.value.split('\n');
    if (lines.length > 4) {
      textarea.value = lines.slice(0, 4).join('\n');
      this.description = textarea.value;
    }
  }

  ngDoCheck(): void {
    this.finalPrice = this.price - (this.price * (this.discount / 100));
  }

  save(): void {
    const productData = {
      name: this.name,
      description: this.description || 'No description provided',
      stock: this.stock,
      price: this.price,
      discount: this.discount,
      finalPrice: this.finalPrice,
      imageUrl: this.imageUrl || 'img/default.png',
      isAvailable: true,
      createdAt: new Date(),
    };

    this.saveProduct.emit(productData);
    this.close();
  }

  resetForm(): void {
    this.name = '';
    this.description = '';
    this.stock = 0;
    this.price = 0;
    this.discount = 0;
    this.finalPrice = 0;
    this.imageUrl = null;
  }
}
