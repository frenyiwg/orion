import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { IUser } from '@core/interfaces';
import { AuthService } from '@core/services';

export const PermissionGuard: CanActivateFn = () => {
  const authUser: IUser | null = inject(AuthService).user;

  if (authUser?.role === 'ADMIN') return true;
  return false;
};
