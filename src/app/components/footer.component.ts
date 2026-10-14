import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../core/config';
import { BoletinService } from '../services/boletin.service';
import { ToastService } from '../services/toast.service';
import { IconoComponent, NombreIcono } from './icono.component';

/** Pie de página con secciones, enlaces, boletín y redes sociales. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule, IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'site-footer', role: 'contentinfo' },
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly boletin = inject(BoletinService);
  private readonly toast = inject(ToastService);

  protected readonly categorias = CATEGORIAS;
  protected readonly redes: { icono: NombreIcono; nombre: string }[] = [
    { icono: 'facebook', nombre: 'Facebook' },
    { icono: 'x', nombre: 'X' },
    { icono: 'instagram', nombre: 'Instagram' },
    { icono: 'youtube', nombre: 'YouTube' },
  ];

  /** Valor del campo de correo (enlace bidireccional con [(ngModel)]). */
  protected correo = '';
  protected readonly invalido = signal(false);

  protected suscribir(): void {
    const ok = this.boletin.suscribir(this.correo);
    this.invalido.set(!ok);
    this.toast.mostrar(
      ok ? '¡Gracias por suscribirte! Revisa tu bandeja de entrada.' : 'Ingresa un correo electrónico válido.',
      ok ? 'ok' : 'error',
    );
    if (ok) this.correo = '';
  }

  protected pendiente(evento: Event): void {
    evento.preventDefault();
    this.toast.mostrar('Esta sección está en construcción (prototipo).');
  }
}
