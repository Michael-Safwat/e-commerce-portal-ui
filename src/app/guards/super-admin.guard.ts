import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRoles = this.authService.getUserRolesFromToken();
    if (userRoles.includes('ROLE_SUPER_ADMIN')) {
      return true;
    } else {
      this.router.navigate(['/dashboard']); // Redirect non-super-admins
      return false;
    }
  }
} 