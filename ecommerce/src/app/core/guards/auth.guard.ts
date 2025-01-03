import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    return this.checkAdminAccess();
  }

  canLoad(): boolean {
    return this.checkAdminAccess();
  }
  private checkAdminAccess(): boolean {
    if (this.authService.isAdmin) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
