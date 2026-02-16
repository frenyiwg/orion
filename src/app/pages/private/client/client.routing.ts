import { Routes } from '@angular/router';
import { PermissionGuard } from '@core/providers/guards/permission.guard';

export const routes: Routes = [
  { redirectTo: 'lista', path: '', pathMatch: 'full' },
  {
    path: 'lista',
    loadComponent: () => import('./client.component').then((m) => m.ClientComponent),
    data: { breadcrumb: '' },
    title: 'Client | Orion',
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./detail/detail.component').then((m) => m.ClientDetailComponent),
    data: { breadcrumb: 'Detalle' },
    title: 'Client - Detalle | Orion',
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./edit/edit.component').then((m) => m.ClientEditComponent),
    data: { breadcrumb: 'Editar' },
    title: 'Client - Editar | Orion',
    canActivate: [PermissionGuard],
  },
  {
    path: 'registrar',
    loadComponent: () => import('./create/create.component').then((m) => m.ClientCreateComponent),
    data: { breadcrumb: 'Registrar' },
    title: 'Client - Registrar | Orion',
    canActivate: [PermissionGuard],
  },
  { redirectTo: 'lista', path: '**' },
];
