import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/providers';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app',
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadChildren: () => import('./private/private.routing').then((m) => m.routes),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./auth/auth.routing').then((m) => m.routes),
  },
];
