import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación. Cada página se carga de forma diferida (lazy loading),
 * por lo que el navegador solo descarga el código de la página que se visita.
 */
export const routes: Routes = [
  { path: '', title: 'NexoNoticias · El análisis profundo y el acontecer diario de Colombia',
    loadComponent: () => import('./pages/home.component').then((m) => m.HomeComponent) },
  { path: 'noticias', title: 'Catálogo de Noticias · NexoNoticias',
    loadComponent: () => import('./pages/noticias.component').then((m) => m.NoticiasComponent) },
  // El título de esta ruta lo fija el propio componente según la noticia mostrada
  { path: 'noticias/:id',
    loadComponent: () => import('./pages/detalle.component').then((m) => m.DetalleComponent) },
  { path: 'favoritos', title: 'Mis Favoritos · NexoNoticias',
    loadComponent: () => import('./pages/favoritos.component').then((m) => m.FavoritosComponent) },
  { path: 'contacto', title: 'Contacto · NexoNoticias',
    loadComponent: () => import('./pages/contacto.component').then((m) => m.ContactoComponent) },
  { path: 'admin', title: 'Administración de noticias · NexoNoticias',
    loadComponent: () => import('./pages/admin.component').then((m) => m.AdminComponent) },
  { path: '**', redirectTo: '' },
];
