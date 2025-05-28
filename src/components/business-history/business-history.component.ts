import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
@Component({
  selector: 'app-business-history',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './business-history.component.html',
  styleUrl: './business-history.component.css'
})
export class BusinessHistoryComponent {
  name: string = 'tinapayan'
  historyDate: string = '01/01/2025'
  historyName: string = 'Customer Name'

}
