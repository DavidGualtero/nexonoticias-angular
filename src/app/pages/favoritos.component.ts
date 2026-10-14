import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorCargaComponent } from '../components/error-carga.component';
import { TarjetaNoticiaComponent } from '../components/tarjeta-noticia.component';
import { Noticia } from '../models/noticia.model';
import { FavoritosService } from '../services/favoritos.service';
import { NoticiasService } from '../services/noticias.service';
import { ToastService } from '../services/toast.service';

/** Lista personalizada de noticias guardadas (se actualiza sola al cambiar el signal de favoritos). */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, TarjetaNoticiaComponent, ErrorCargaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent {
  protected readonly servicio = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  /** Respeta el orden en que el usuario las guardó e ignora ids de noticias eliminadas. */
  protected readonly lista = computed(() =>
    this.favoritos
      .ids()
      .map((id) => this.servicio.noticias().find((n) => n.id === id))
      .filter((n): n is Noticia => n !== undefined),
  );

  protected vaciar(): void {
    if (confirm('¿Quieres quitar todas las noticias de tu lista de favoritos?')) {
      this.favoritos.vaciar();
      this.toast.mostrar('Lista de favoritos vaciada');
    }
  }
}
