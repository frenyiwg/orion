import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { routes } from './app/app.routing';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAuthInitializer } from '@core/providers/common';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideAuthInitializer(),
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
}).catch((err) => console.error(err));
