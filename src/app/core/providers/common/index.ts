import { inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '@core/services';
import { TokenManager } from '@core/utils';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function provideAuthInitializer() {
  return makeEnvironmentProviders([
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const tokenManager = new TokenManager();

      const token = tokenManager.getToken?.();

      await delay(2000);

      if (!token) {
        router.navigate(['/auth/login']);
        return;
      }

      try {
        await firstValueFrom(authService.me());
      } catch (e) {
        tokenManager.removeToken?.();
        router.navigate(['/auth/login']);
      }
    }),
  ]);
}
