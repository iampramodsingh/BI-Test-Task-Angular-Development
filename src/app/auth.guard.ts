import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from './api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const api = inject(ApiService);
 
  if(api.getLoggedInUser() != null ) {
    return true;

  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
