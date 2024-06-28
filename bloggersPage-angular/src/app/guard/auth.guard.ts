import {inject, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {TokenStorageService} from "../auth/token-storage.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  const tokenStorageService = inject(TokenStorageService);
  const router = inject(Router);

  for (let i = 0; i < route.data['roles'].length; i++) {
    for (let j = 0; j < tokenStorageService.getAuthorities().length; j++) {
      if (route.data['roles'][i] === tokenStorageService.getAuthorities()[j]) {
        return true;
      }
    }
  }

  return router.parseUrl('');
};
