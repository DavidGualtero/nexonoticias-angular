import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ErrorCargaComponent } from '../components/error-carga.component';
import { IconoComponent } from '../components/icono.component';
import { FechaCortaPipe, FechaLargaPipe, InicialesPipe } from '../pipes/formato.pipes';
import { FavoritosService } from '../services/favoritos.service';
import { NoticiasService } from '../services/noticias.service';
import { ToastService } from '../services/toast.service';

/** Detalle de una noticia (/noticias/:id). El `id` llega como input desde la ruta. */
@Component({
  selector: 'app-detalle',
  imports: [RouterLink, IconoComponent, ErrorCargaComponent, FechaCortaPipe, FechaLargaPipe, InicialesPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'detalle-fondo' },
  templateUrl: './detalle.component.html',
})
export class DetalleComponent {
  readonly id = input.required<string>();

  protected readonly servicio = inject(NoticiasService);
  protected readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);
  private readonly titulo = inject(Title);

  protected readonly noticia = computed(() => this.servicio.obtener(Number(this.id())));
  protected readonly autor = computed(() => {
    const n = this.noticia();
    return n ? this.servicio.autor(n.autor) : undefined;
  });
  protected readonly esFavorito = computed(() => this.favoritos.ids().includes(Number(this.id())));

  /** Prioriza noticias de la misma categoría; completa con las más recientes. */
  protected readonly relacionadas = computed(() => {
    const actual = this.noticia();
    if (!actual) return [];
    const otras = this.servicio.noticias().filter((n) => n.id !== actual.id);
    const mismas = otras.filter((n) => n.categoria === actual.categoria);
    return [...mismas, ...otras.filter((n) => !mismas.includes(n))].slice(0, 3);
  });

  constructor() {
    // Mantiene el título de la pestaña sincronizado con la noticia mostrada
    effect(() => {
      const n = this.noticia();
      this.titulo.setTitle(n ? `${n.titulo} · NexoNoticias` : 'Noticia no encontrada · NexoNoticias');
    });
  }

  protected alternarFavorito(): void {
    const guardada = this.favoritos.alternar(Number(this.id()));
    this.toast.mostrar(guardada ? 'Noticia agregada a favoritos' : 'Noticia quitada de favoritos');
  }

  /** Usa el menú nativo de compartir si existe; si no, copia el enlace. */
  protected async compartir(): Promise<void> {
    const n = this.noticia();
    if (!n) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: n.titulo, text: n.resumen, url: location.href });
        return;
      }
      await navigator.clipboard.writeText(location.href);
      this.toast.mostrar('Enlace copiado al portapapeles');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') this.toast.mostrar('No se pudo compartir el enlace', 'error');
    }
  }
}
