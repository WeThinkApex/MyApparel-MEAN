import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountDialogComponent } from '../../account-dialog/account-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logoUrl: string = 'assets/images/logo.png';
  cartItemCount: number = 0;
  isAuthenticated = false;
  user: { name: string, email: string } = { name: '', email: '' };
  
  categories = [
    { name: 'ALL CATEGORIES', path: '/all-categories' },
    { name: 'GIRLS FASHION', path: '/girls-fashion' },
    { name: 'BOYS FASHION', path: '/boys-fashion' },
    
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        this.user = { 
          name: currentUser.name, 
          email: currentUser.email 
        };
      }
    }
  }

  navigateHome() {
    this.router.navigate(['/']);
  }

  openAccountDialog(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '350px',
      position: {
        top: '70px',
        left: `${event.clientX - 135}px`,
      },
      data: {
        name: this.user.name,
        email: this.user.email
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}