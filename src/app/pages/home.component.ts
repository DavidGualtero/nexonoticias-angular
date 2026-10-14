import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ErrorCargaComponent } from '../components/error-carga.component';
import { IconoComponent } from '../components/icono.component';
import { TarjetaNoticiaComponent } from '../components/tarjeta-noticia.component';
import { ContadorDirective } from '../directives/contador.directive';
import { BoletinService } from '../services/boletin.service';
import { NoticiasService } from '../services/noticias.service';

/** Página de inicio: hero, destacados, cita con estadísticas y suscripción al boletín. */
@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule, IconoComponent, TarjetaNoticiaComponent, ErrorCargaComponent, ContadorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly servicio = inject(NoticiasService);
  private readonly boletin = inject(BoletinService);

  /** Destacadas primero; si hay menos de 3, se completa con las más recientes. */
  protected readonly destacadas = computed(() => {
    const todas = this.servicio.noticias();
    return [...todas.filter((n) => n.destacada), ...todas.filter((n) => !n.destacada)].slice(0, 3);
  });

  /** Enlace del botón "Última Hora": la noticia más reciente. */
  protected readonly ultima = computed(() => {
    const n = this.servicio.noticias()[0];
    return n ? ['/noticias', n.id] : ['/noticias'];
  });

  protected correo = '';
  protected readonly mensaje = signal<{ texto: string; ok: boolean } | null>(null);

  protected suscribir(): void {
    const ok = this.boletin.suscribir(this.correo);
    this.mensaje.set({
      ok,
      texto: ok ? '¡Gracias por suscribirte! Revisa tu bandeja de entrada.' : 'Ingresa un correo electrónico válido.',
    });
    if (ok) this.correo = '';
  }
}
