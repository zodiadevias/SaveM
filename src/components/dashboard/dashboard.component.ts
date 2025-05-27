import { Component , HostListener, OnInit} from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../modal/modal/modal.component';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { UserdataService } from '../../services/userdata.service';


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


  name : any = '';
  public chart: any;
  whatAmI = '';
  
  



  constructor(private globalService: GlobalService, public authService: AuthService, public firestoreService: FirestoreService, private userdataService: UserdataService) {
    // this.globalService.setWhatAmIHead('guest');
    
  }


  async getUserData() {
    return await this.userdataService.getUserData();
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

  async ngOnInit() {
    this.screenWidth = window.innerWidth;
    
  }

  ngDoCheck() {
    this.whatAmI = this.globalService.getWhatAmIDashboard();
    console.log(this.whatAmI);
    
  }
  
  


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }


  
}
