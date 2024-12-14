import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes, UrlTree } from '@angular/router';
import { FireAuthService } from './services/fire.auth.service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree=> {

    return inject(FireAuthService).isLoggedin() ? true
    : inject(Router).createUrlTree(['login'])
  }

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    canActivateChild: [AuthGuard],
    loadComponent: () => import('./home/home.page').then( m => m.HomePage),
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home-routs').then(r => r.NESTED_ROUTS),
      }
    ]
  },
];
