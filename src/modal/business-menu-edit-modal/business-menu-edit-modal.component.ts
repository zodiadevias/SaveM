import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-menu-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './business-menu-edit-modal.component.html',
  styleUrl: './business-menu-edit-modal.component.css'
})
export class BusinessMenuEditModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() itemId: string = '';
  @Input() itemName: string = '';
  @Input() itemDescription: string = '';
  @Input() itemStock: number = 0;
  @Input() itemPrice: number = 0;
  @Input() itemDiscount: number = 0;
  @Input() itemFinalPrice: number = 0;
  @Input() itemImageUrl: string = '';
  @Input() itemIsAvailable: boolean = false;

  @Output() closeEditModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  name: string = '';
  description: string = '';
  stock: number = 0;
  price: number = 0;
  discount: number = 0;
  finalPrice: number = 0;
  imageUrl: string | null = null;

  toggleEditName: boolean = false;
  toggleEditDescription: boolean = false;
  toggleStock: boolean = false;
  togglePrice: boolean = false;
  toggleDiscount: boolean = false;
  toggleConfirmation: boolean = false;

  ngOnChanges(): void {
    this.name = this.itemName;
    this.description = this.itemDescription || 'Click me to add a description';
    this.stock = this.itemStock;
    this.price = this.itemPrice;
    this.discount = this.itemDiscount;
    this.finalPrice = this.itemFinalPrice;
    this.imageUrl = this.itemImageUrl;
  }

  ngDoCheck() {
    this.finalPrice = this.price - (this.price * (this.discount / 100));
  }

  close(): void {
    this.closeEditModal.emit();
    this.resetToggles();
  }

  toggleEdit() {
    this.toggleEditName = !this.toggleEditName;
  }

  toggleEditDesc() {
    this.toggleEditDescription = !this.toggleEditDescription;
  }

  enforceLineLimit(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const lines = textarea.value.split('\n');
    if (lines.length > 4) {
      textarea.value = lines.slice(0, 4).join('\n');
      this.description = textarea.value;
    }
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

  saveChanges(): void {
    this.save.emit({
      id: this.itemId,
      name: this.name,
      description: this.description,
      stock: this.stock,
      price: this.price,
      discount: this.discount,
      finalPrice: this.finalPrice,
      isAvailable: this.itemIsAvailable,
      imageFile: this.fileInput?.nativeElement?.files?.[0] ?? null
    });
    this.close();
  }

  confirmDelete(): void {
    this.delete.emit(this.itemId);
    this.toggleConfirmation = false;
    this.close();
  }

  private resetToggles() {
    this.toggleEditName = false;
    this.toggleEditDescription = false;
    this.toggleConfirmation = false;
    this.toggleStock = false;
    this.togglePrice = false;
    this.toggleDiscount = false;
  }
}
