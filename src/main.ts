import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { routes } from './app/app.routing';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAuthInitializer } from '@core/providers/common';

bootstrapApplication(App, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideAuthInitializer(),
  ],
}).catch((err) => console.error(err));
