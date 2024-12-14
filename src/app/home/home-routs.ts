import { Routes } from '@angular/router';

export const NESTED_ROUTS: Routes = [
  {
    path: 'price',
    loadComponent: () =>
      import('./price/price.page').then(c => c.PricePage),
  },
  {
    path: 'visits',
    loadComponent: () =>
      import('./visits/visits.page').then(c => c.VisitsPage),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'price',
  },
];
