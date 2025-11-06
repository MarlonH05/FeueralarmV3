import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RestService } from '../services/rest.service';

export const authGuard: CanActivateFn = (route, state) => {
  const restService = inject(RestService);
  const router = inject(Router);

  return restService.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], {
        queryParams: { redirect: state.url },
      });
};

export const loginGuard: CanActivateFn = (route, state) => {
  const restService = inject(RestService);
  const router = inject(Router);

  // Wenn bereits eingeloggt, redirect zu home
  return restService.isAuthenticated() ? router.createUrlTree(['/home']) : true;
};
