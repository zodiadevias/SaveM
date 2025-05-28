import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-menu-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './business-menu-modal.component.html',
  styleUrl: './business-menu-modal.component.css'
})
export class BusinessMenuModalComponent {
  name: string = 'Banana Bread';
  description: string = '';
  stock: number = 0;
  price: number = 0;
  discount: number = 0;
  finalPrice: number = this.price * (this.discount / 100.0);

  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
        this.closeModal.emit();
        this.toggleEditName = false;
        this.toggleEditDescription = false;
        this.toggleConfirmation = false;
        this.toggleStock = false;
        this.togglePrice = false;
        this.toggleDiscount = false;
  }

  toggleEditName: boolean = false;
  toggleEditDescription: boolean = false;
  toggleStock: boolean = false;
  togglePrice: boolean = false;
  toggleDiscount: boolean = false;
  toggleConfirmation: boolean = false;


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
    // Limit to first 4 lines
    textarea.value = lines.slice(0, 4).join('\n');
    this.description = textarea.value;
  }
}

  ngDoCheck() {
    this.finalPrice = this.price * (this.discount / 100);
    if(this.description == '') {
      this.description = 'Click me to add a description';
    }
  }


  
  
  imageUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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



  

}
