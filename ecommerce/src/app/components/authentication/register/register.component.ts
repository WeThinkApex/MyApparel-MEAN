import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  isAdmin: boolean = false;
  showAdminOption: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackbarService
  ) {
    this.showAdminOption = this.router.url === '/register/admin';
    this.isAdmin = this.showAdminOption;
  }

  ngOnInit() {
    // Any additional initialization logic
  }

  onSubmit() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      isAdmin: this.isAdmin
    };

    this.authService.register(userData).subscribe(
      (response: any) => {
        if (response && response.message === 'User already exists') {
          this.snackBar.errorSnackBar('User already exists. Please use a different email.')
        } else {
          this.snackBar.successSnackBar('Registration successful!')
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        this.snackBar.errorSnackBar('Registration failed, please try again.')
      }
    );
  }


}
