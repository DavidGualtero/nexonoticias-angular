import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { IconoComponent } from './icono.component';

/** Contenedor de avisos emergentes; se coloca una sola vez en AppComponent. */
@Component({
  selector: 'app-toasts',
  imports: [IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of servicio.toasts(); track t.id) {
        <div class="toast" [class.error]="t.tipo === 'error'">
          <app-icono [nombre]="t.tipo === 'error' ? 'alerta' : 'check'" />
          <span>{{ t.mensaje }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastsComponent {
  protected readonly servicio = inject(ToastService);
}
