import { Routes } from '@angular/router';

export const routes: Routes = [
  { redirectTo: 'lista', path: '', pathMatch: 'full' },
  {
    path: 'lista',
    loadComponent: () => import('./employee.component').then((m) => m.EmployeeComponent),
    data: { breadcrumb: '' },
    title: 'Employee | Orion',
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./detail/detail.component').then((m) => m.EmployeeDetailComponent),
    data: { breadcrumb: 'Detalle' },
    title: 'Employee | Orion',
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./edit/edit.component').then((m) => m.EmployeeEditComponent),
    data: { breadcrumb: 'Editar' },
    title: 'Employee | Orion',
  },
  { redirectTo: 'lista', path: '**' },
];
