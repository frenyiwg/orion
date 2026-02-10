import { Routes } from '@angular/router';
import { AppPages } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: AppPages,
  },
  //   {
  //     path: '',
  //     pathMatch: 'full',
  //     redirectTo: 'app'
  //   },
  //   {
  //     path: 'app',
  //     loadChildren: () => import('./private/private.routing').then((m) => m.APP_ROUTES),
  //   },
  //   {
  //     path: 'auth',
  //     loadChildren: () => import('./auth/auth.routing').then((m) => m.AUTH_ROUTES),
  //   },
  //   {
  //     path: '**',
  //     redirectTo: 'app',
  //   },
];
