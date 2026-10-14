import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // Rutas con # (p. ej. /#/noticias): evitan el error 404 al recargar en GitHub Pages
      withHashLocation(),
      // Los parámetros de la ruta y de la URL llegan como inputs de cada componente
      withComponentInputBinding(),
      // Al navegar, vuelve al inicio de la página
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
  ],
};
