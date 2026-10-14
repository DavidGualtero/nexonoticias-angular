import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../services/favoritos.service';
import { IconoComponent } from './icono.component';

/** Encabezado con logotipo, menú de navegación, buscador y clima. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'site-header', role: 'banner' },
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly favoritos = inject(FavoritosService);
  private readonly router = inject(Router);

  protected readonly paginas = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/noticias', texto: 'Noticias' },
    { ruta: '/favoritos', texto: 'Favoritos' },
    { ruta: '/contacto', texto: 'Contacto' },
    { ruta: '/admin', texto: 'Admin' },
  ];

  protected readonly menuAbierto = signal(false);
  protected readonly termino = signal('');

  protected alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  /** Envía la búsqueda al catálogo mediante un parámetro de consulta (?q=...). */
  protected buscar(evento: Event): void {
    evento.preventDefault();
    this.router.navigate(['/noticias'], { queryParams: { q: this.termino().trim() || null } });
    this.termino.set('');
    this.cerrarMenu();
  }

  protected alEscribir(evento: Event): void {
    this.termino.set((evento.target as HTMLInputElement).value);
  }
}
