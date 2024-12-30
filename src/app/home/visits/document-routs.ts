import { Routes } from '@angular/router';

export const NESTED_ROUTS: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./document-list/document-list.page').then(c => c.DocumentListPage),
  },

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
