import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Mensaje de error de carga con botón para reintentar (@Input / @Output). */
@Component({
  selector: 'app-error-carga',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vacio" role="alert">
      <h2>No pudimos cargar las noticias</h2>
      <p>{{ detalle() }}</p>
      <button type="button" class="btn btn-primario" (click)="reintentar.emit()">Reintentar</button>
    </div>
  `,
})
export class ErrorCargaComponent {
  readonly detalle = input('');
  readonly reintentar = output<void>();
}
