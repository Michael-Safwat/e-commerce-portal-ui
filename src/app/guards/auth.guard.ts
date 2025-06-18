import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = () => {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['login']);
  }
};
