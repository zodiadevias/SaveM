import { Component , HostListener, OnInit} from '@angular/core';
import { HeaderComponent } from "../header/header.component";

import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal/modal.component';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  screenWidth: number = window.innerWidth;

  isModalOpen: boolean = false;
  isVisible: boolean = false;


  name : string = 'Tinapayan';
  public chart: any;
  whatAmI = 'guest';

  constructor(private globalService: GlobalService, public authService: AuthService) {
    // this.globalService.setWhatAmIHead('guest');
  }

openModal(whatAmI: string): void {
  this.globalService.setWhatAmI(whatAmI);
  this.isModalOpen = true;
  this.isVisible = false;
}

checkUser() {
  console.log(this.authService.currentUser);
  if (!this.authService.currentUser) {
    this.openModal('guest');
  }
}

closeModal() {
  this.isModalOpen = false;
}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }



  // ngOnInit(){
  //   this.createChart('line','lineChart');
    
  // }


  // constructor() { 
  //   this.createChart('line','lineChart');
  // }
  
  // createChart(t: any, name: any){

  //   this.chart = new Chart(name, {
  //     type: t,

  //     data: {
  //       labels: [
  //         ...Array.from({length: 31}, (_, i) => (i+1).toString())
  //       ], 
  //          datasets: [
  //         {
  //           label: "",
  //           data: Array.from({length: 31}, (_, i) => ((i + Math.random()*100) * Math.random() * 10000).toString()),
  //           backgroundColor: 'white',
  //           borderColor: 'white',
  //           borderWidth: 2,
  //           fill: true,
  //           pointBackgroundColor: '#1A5319',
            
            
            
  //         }
  //       ]
  //     },
  //     options: {
        
  //       maintainAspectRatio: false,
  //       labels: {
  //         color: '#FEFAE0'
  //       },
  //       tooltip: {
  //         bodyColor: '#FEFAE0'
  //       },
  //       scales: {
  //         x: {
  //           ticks: {
  //             color: '#FEFAE0'
  //           }
  //         },
  //         y: {
  //           ticks: {
  //             color: '#FEFAE0'
  //           }
  //         }
  //       },
        
  //     }

  //   });
  // }

}
