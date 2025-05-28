import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-business-inbox',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './business-inbox.component.html',
  styleUrl: './business-inbox.component.css'
})
export class BusinessInboxComponent {
  name: string = 'tinapayan';

}
