import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountDialogComponent } from '../../account-dialog/account-dialog.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logoUrl: string = 'assets/images/my-apparel.svg';
  cartItemCount: number = 0;
  isAuthenticated = false;
  isAdmin = false;
  isAdminRoute = false;
  showAdminHeader = false
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
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.includes('/admin');
      this.checkHeaderView();
    });
  }
  isMobileView: boolean = false;
  isMobileMenuOpen: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  ngOnInit(): void {
    this.checkScreenSize();
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        this.user = { 
          name: currentUser.name, 
          email: currentUser.email 
        };
        this.isAdmin = currentUser.isAdmin;
        this.checkHeaderView();
      }
    }
  }

  navigateHome(): void {
    if (this.isAdmin && this.isAdminRoute) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/demo']);
    }
  }
  checkHeaderView(): void {
    this.showAdminHeader = this.isAdmin || this.isAdminRoute;
  }
   checkScreenSize() {
    this.isMobileView = window.innerWidth <= 768;
    if (!this.isMobileView) {
      this.isMobileMenuOpen = false;
    }
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
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
    this.router.navigate(['admin/login']);
  }
}