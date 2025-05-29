import { Component, HostListener, OnInit } from '@angular/core';
import { ModalComponent } from '../../modal/modal/modal.component';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-header',
  imports: [ModalComponent, CommonModule , RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  
})
export class HeaderComponent implements OnInit {
  screenWidth: number = window.innerWidth;

  dropdownOpen: boolean = false;
  toggleDropdown() {
    const el: any = document.getElementById("header-right-links");
    el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
    this.dropdownOpen = !this.dropdownOpen;
    el.style.animate = "slideUp 0.3s ease-in-out";
    
  }

  toggleDropdownUp() {
    const el: any = document.getElementById("header-right-links");
    
    el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
    this.dropdownOpen = !this.dropdownOpen;
    
  }



  isModalOpen: boolean = false;
  isVisible: boolean = false;

  constructor(private globalService: GlobalService, private router: Router, public authService: AuthService) {
    
  }

  


openModal(whatAmI: string): void {
  this.globalService.setWhatAmI(whatAmI);
  this.isModalOpen = true;
  this.isVisible = false;
}

closeModal() {
  this.isModalOpen = false;
}

  whatAmI = '';

  ngOnInit() {
    this.whatAmI = this.globalService.getWhatAmIHead();
    console.log(this.whatAmI);
    this.screenWidth = window.innerWidth;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    const el: any = document.getElementById("header-right-links");
    if(this.screenWidth < 1400){
      el.style.display = "none";
    }else{
      el.style.display = "flex";
      
    }
  }

  ngDoCheck() {
    this.whatAmI = this.globalService.getWhatAmIHead();
    
    
  }


isOpen: boolean = false;


login(user: string){
  this.openModal(user);
}

signup(user: string){
  this.openModal(user);
}


logout(){
  this.authService.logout()
    .then(() => {
      
      this.globalService.setWhatAmIHead('guest');
    })
    .catch(err => console.error('Logout error:', err));
}
}
