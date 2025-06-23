import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.hasSuperAdminRole()) {
      return true;
    } else {
      // Redirect to dashboard if user has admin role, otherwise to login
      if (this.authService.hasValidAdminRole()) {
        this.router.navigate(['/dashboard']);
      } else {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
} 