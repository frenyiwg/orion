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
        path: 'employee',
        loadChildren: () => import('./employee/employee.routing').then((m) => m.routes),
        data: { breadcrumb: 'Empleados' },
        title: 'Employee | Orion',
      },
    ],
  },
];
