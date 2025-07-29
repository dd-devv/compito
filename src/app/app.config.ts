import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

import {
  provideTanStackQuery,
  QueryClient,
  withDevtools
} from '@tanstack/angular-query-experimental';

const isServer = typeof window === 'undefined';

const cssLayerConfig = isServer ? true : {
  name: 'primeng',
  order: 'theme, base, primeng'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.my-app-dark',
          cssLayer: true
        }
      }
    }),
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
    provideServiceWorker('ngsw-worker.js', {
      registrationStrategy: 'registerImmediately'
    })
  ]
};
