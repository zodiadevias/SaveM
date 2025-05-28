import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-signup',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './business-signup.component.html',
  styleUrl: './business-signup.component.css'
})
export class BusinessSignupComponent {

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
