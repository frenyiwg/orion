import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
        data: { breadcrumb: '' },
        title: 'Home | Orion',
      },
      {
        path: 'client',
        loadChildren: () => import('./client/client.routing').then((m) => m.routes),
        data: { breadcrumb: 'Clientes' },
        title: 'Client | Orion',
      },
    ],
  },
];
