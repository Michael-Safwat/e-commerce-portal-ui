import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated and has valid admin role
  if (authService.isAuthenticated() && authService.hasValidAdminRole()) {
    return true;
  } else {
    // Clear any invalid token and redirect to login
    authService.logout();
    return router.navigate(['/login']);
  }
};
