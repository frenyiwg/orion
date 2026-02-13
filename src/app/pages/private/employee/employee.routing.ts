import { Routes } from '@angular/router';
import { PermissionGuard } from '@core/providers/guards/permission.guard';

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
    title: 'Employee - Detalle | Orion',
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./edit/edit.component').then((m) => m.EmployeeEditComponent),
    data: { breadcrumb: 'Editar' },
    title: 'Employee - Editar | Orion',
    canActivate: [PermissionGuard],
  },
  {
    path: 'registrar',
    loadComponent: () => import('./create/create.component').then((m) => m.EmployeeCreateComponent),
    data: { breadcrumb: 'Registrar' },
    title: 'Employee - Registrar | Orion',
    canActivate: [PermissionGuard],
  },
  { redirectTo: 'lista', path: '**' },
];
