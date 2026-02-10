import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { routes } from './app/app.routing';
import { provideRouter } from '@angular/router';

bootstrapApplication(App, {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes)],
}).catch((err) => console.error(err));
