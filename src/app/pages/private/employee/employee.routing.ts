import { Routes } from '@angular/router';

export const routes: Routes = [
  { redirectTo: '', path: '', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./employee.component').then((m) => m.EmployeeComponent),
    data: { breadcrumb: '' },
    title: 'Employee | Orion',
  },
  { redirectTo: '', path: '**' },
];
