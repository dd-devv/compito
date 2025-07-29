import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { providePrimeNG } from 'primeng/config';

async function main() {
  const isClient = typeof window !== 'undefined';

  if (isClient) {
    const { default: Aura } = await import('@primeuix/themes/aura');

    // ✅ Añadir el provider directamente, sin importProvidersFrom
    appConfig.providers.push(
      providePrimeNG({
        theme: {
          preset: Aura,
          options: {
            prefix: 'p',
            darkModeSelector: '.my-app-dark',
            cssLayer: {
              name: 'primeng',
              order: 'theme, base, primeng'
            }
          }
        }
      })
    );
  }

  await bootstrapApplication(AppComponent, appConfig);
}

main().catch((err) => console.error(err));
