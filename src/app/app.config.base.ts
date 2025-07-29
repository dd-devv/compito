import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import {
  provideTanStackQuery,
  QueryClient,
  withDevtools
} from '@tanstack/angular-query-experimental';

export const appConfigBase: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
    provideServiceWorker('ngsw-worker.js', {
      registrationStrategy: 'registerImmediately'
    })
  ]
};
