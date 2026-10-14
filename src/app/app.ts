import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { ToastsComponent } from './components/toasts.component';

/** Componente raíz: encabezado, contenido de la ruta activa, pie y avisos. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
})
export class App {
  /** "Saltar al contenido" sin alterar la ruta (la app usa rutas con #). */
  protected irAlContenido(evento: Event, principal: HTMLElement): void {
    evento.preventDefault();
    principal.focus();
  }
}
