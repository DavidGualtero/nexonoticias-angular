import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../models/noticia.model';
import { FechaCortaPipe } from '../pipes/formato.pipes';
import { FavoritosService } from '../services/favoritos.service';
import { ToastService } from '../services/toast.service';
import { IconoComponent } from './icono.component';

/**
 * Tarjeta de noticia reutilizable (Inicio, Catálogo y Favoritos).
 * Recibe la noticia por @Input (input signal) y gestiona su propio botón de favorito.
 */
@Component({
  selector: 'app-tarjeta-noticia',
  imports: [RouterLink, IconoComponent, FechaCortaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tarjeta-noticia.component.html',
})
export class TarjetaNoticiaComponent {
  readonly noticia = input.required<Noticia>();

  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  protected readonly esFavorito = computed(() => this.favoritos.ids().includes(this.noticia().id));
  protected readonly accion = computed(() => (this.esFavorito() ? 'Quitar de favoritos' : 'Agregar a favoritos'));

  protected alternarFavorito(): void {
    const guardada = this.favoritos.alternar(this.noticia().id);
    this.toast.mostrar(guardada ? 'Noticia agregada a favoritos' : 'Noticia quitada de favoritos');
  }
}
