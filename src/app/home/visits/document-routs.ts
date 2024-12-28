import { Routes } from '@angular/router';

export const NESTED_ROUTS: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./document-list/document-list.page').then(c => c.DocumentListPage),
    children: [
      {
        path: 'details/{id}',
        loadComponent: () =>
          import('./document-detail/document-detail.page').then(c => c.DocumentDetailPage),
      },
    ]
  },

  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
