import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:[ './login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private authService: AuthService, private router: Router,private snackBar: SnackbarService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (user:any) => {
        if (user.role === 'admin') {
          this.snackBar.successSnackBar('Admin login successful!')
          this.router.navigate(['/admin/dashboard']); // Navigate to the admin dashboard
        } else {
          this.snackBar.successSnackBar('Login successful!')
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.snackBar.errorSnackBar('Invalid credentials, please try again.')
      }
    );
  }
}
