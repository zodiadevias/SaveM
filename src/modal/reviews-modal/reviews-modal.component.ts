import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-reviews-modal',
  imports: [CommonModule],
  templateUrl: './reviews-modal.component.html',
  styleUrl: './reviews-modal.component.css'
})
export class ReviewsModalComponent {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  @Input() storename = '';
  @Input() storeaddress = '';
  @Input() reviews = '';
  @Input() totalratings = 0;
  @Input() userreview = '';
  @Input() date = '';
  @Input() comments = '';

  close(): void {
    this.closeModal.emit();
  }
}

