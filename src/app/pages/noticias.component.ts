import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorCargaComponent } from '../components/error-carga.component';
import { IconoComponent } from '../components/icono.component';
import { TarjetaNoticiaComponent } from '../components/tarjeta-noticia.component';
import { CATEGORIAS } from '../core/config';
import { NoticiasService } from '../services/noticias.service';

/** Minúsculas y sin tildes, para que "politica" encuentre "Política". */
const normalizar = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * Catálogo con búsqueda y filtro por categoría. El filtro vive en la URL
 * (?q=...&categoria=...): el router entrega esos valores como inputs del componente.
 */
@Component({
  selector: 'app-noticias',
  imports: [IconoComponent, TarjetaNoticiaComponent, ErrorCargaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './noticias.component.html',
})
export class NoticiasComponent {
  protected readonly servicio = inject(NoticiasService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  // Parámetros de la URL (withComponentInputBinding)
  readonly q = input<string | undefined>();
  readonly categoria = input<string | undefined>();

  // Estado local que se reinicia cuando cambia la URL
  protected readonly consulta = linkedSignal(() => this.q() ?? '');
  protected readonly categoriaActiva = linkedSignal(() => {
    const c = this.categoria();
    return c && (CATEGORIAS as readonly string[]).includes(c) ? c : 'Todas';
  });

  protected readonly opciones = ['Todas', ...CATEGORIAS];

  protected readonly resultado = computed(() => {
    const texto = normalizar(this.consulta().trim());
    const cat = this.categoriaActiva();
    return this.servicio.noticias().filter((n) => {
      const coincideCategoria = cat === 'Todas' || n.categoria === cat;
      const contenido = normalizar(`${n.titulo} ${n.resumen} ${n.categoria} ${n.etiqueta ?? ''}`);
      return coincideCategoria && (!texto || contenido.includes(texto));
    });
  });

  protected buscar(evento: Event): void {
    this.consulta.set((evento.target as HTMLInputElement).value);
    this.actualizarUrl();
  }

  protected elegir(categoria: string): void {
    this.categoriaActiva.set(categoria);
    this.actualizarUrl();
  }

  protected limpiar(): void {
    this.consulta.set('');
    this.categoriaActiva.set('Todas');
    this.actualizarUrl();
  }

  /** Refleja el filtro en la URL sin añadir entradas al historial. */
  private actualizarUrl(): void {
    this.router.navigate([], {
      relativeTo: this.ruta,
      replaceUrl: true,
      queryParams: {
        q: this.consulta().trim() || null,
        categoria: this.categoriaActiva() === 'Todas' ? null : this.categoriaActiva(),
      },
    });
  }
}
