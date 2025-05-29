import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-notification-modal',
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.css'
})
export class NotificationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() message: string = '';
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }
}
