import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.hasValidAdminRole()) {
      return true;
    } else {
      // User doesn't have admin role, redirect to login
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
} 