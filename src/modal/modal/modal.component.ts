import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { FirestoreService } from '../../services/firestore.service';
@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
      login = true;
      msg = '';

      gotoSignUp() {
        this.login = false;
      }
      
      @Input() isOpen: boolean = false;
      @Output() closeModal = new EventEmitter<void>();

      whatami = ''
      constructor(private globalService: GlobalService, public authService: AuthService, public FirestoreService: FirestoreService) {
        
      }

      ngOnInit() {
        this.whatami = this.globalService.getWhatAmI();
      }

      ngDoCheck() {
        this.whatami = this.globalService.getWhatAmI();
      }

      


      close(): void {
        this.clearFields();
        this.closeModal.emit();
      }

    thisisme(whatami: string) {
      this.whatami = whatami;
    }


      email = '';
      password = '';
      name = '';
      address = '';
      phone = '';
      contact = '';
      
      clearFields() {
        this.email = '';
        this.password = '';
        this.name = '';
        this.address = '';
        this.phone = '';
        this.contact = '';
        this.msg = '';
      }

      async onLogin() {
        this.authService.login(this.email, this.password)
          .then(async user => {
            
            const role = await this.FirestoreService.getUserRole(user.user.uid);
            if (role === 'customer') {
              this.globalService.setWhatAmIHead('user');
            }else{
              this.globalService.setWhatAmIHead('store');
            }
            this.close();
            
          })
          .catch(err =>{ 
            console.error('Login error:', err);
            this.msg = 'Invalid email or password';

          });
      }

      onRegister() {
        this.authService.register(this.email, this.password)
          .then(cred => {
            const user: User = {
            uid: cred.user.uid,
            email: cred.user.email!,
            name: this.name,
            role: 'customer',
          };
          this.FirestoreService.createUser(user);
          console.log('User registered:', cred.user);
          this.close();
          this.clearFields();
          })
          .catch(err => {
            console.error('Register error:', err)
            this.msg = err.message;

          });
      }

      onGoogleLogin() {
        this.authService.loginWithGoogle()
          .then(result => {
            console.log('Logged in with Google:', result.user);
            this.close();
            this.globalService.setWhatAmIHead('user');
          })
          .catch(error => {
            console.error('Google login error:', error);
            this.msg = error.message;
          });
      }

      onLogout() {
        this.authService.logout()
          .then(() => console.log('User logged out'))
          .catch(err => console.error('Logout error:', err));
      }

}
