import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconoComponent } from '../components/icono.component';
import { ASUNTOS, CLAVES } from '../core/config';
import { guardar, leer } from '../core/storage';
import { correo, estadoCampo, maximo, minimo, requerido } from '../core/validacion';
import { MensajeContacto } from '../models/noticia.model';
import { NoticiasService } from '../services/noticias.service';

/**
 * Formulario de contacto con formularios reactivos (ReactiveFormsModule).
 * Validaciones: nombre (obligatorio, ≥3), correo (obligatorio y válido), mensaje (10–1000).
 * Al enviar, guarda el mensaje en localStorage y muestra una confirmación.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule, IconoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contacto-fondo' },
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  // Parámetros de la URL: /contacto?asunto=comentario&noticia=ID
  readonly asunto = input<string | undefined>();
  readonly noticia = input<string | undefined>();

  private readonly noticias = inject(NoticiasService);
  private readonly confirmacion = viewChild<ElementRef<HTMLElement>>('confirmacion');

  protected readonly asuntos = ASUNTOS;
  protected readonly enviado = signal<string | null>(null);

  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [requerido, minimo(3)] }),
    correo: new FormControl('', { nonNullable: true, validators: [requerido, correo] }),
    asunto: new FormControl('', { nonNullable: true }),
    mensaje: new FormControl('', { nonNullable: true, validators: [requerido, minimo(10), maximo(1000)] }),
  });

  protected readonly estado = estadoCampo;

  constructor() {
    // Prellenado cuando se llega desde el ícono de comentario de una noticia
    effect(() => {
      const a = this.asunto();
      if (a && ASUNTOS.some((x) => x.valor === a)) this.form.controls.asunto.setValue(a);
    });
    effect(() => {
      const id = this.noticia();
      const n = id ? this.noticias.obtener(Number(id)) : undefined;
      if (n && !this.form.controls.mensaje.value) {
        this.form.controls.mensaje.setValue(`Comentario sobre la noticia «${n.titulo}»:\n\n`);
      }
    });
  }

  /** El aviso verde aparece cuando nombre y correo ya son válidos. */
  protected datosValidos(): boolean {
    return this.form.controls.nombre.valid && this.form.controls.correo.valid;
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const primero = (['nombre', 'correo', 'mensaje'] as const).find((c) => this.form.controls[c].invalid);
      setTimeout(() => document.getElementById(primero ?? 'nombre')?.focus());
      return;
    }
    const datos = this.form.getRawValue();
    const mensajes = leer<MensajeContacto[]>(CLAVES.mensajes, []);
    guardar(CLAVES.mensajes, [...mensajes, { id: Date.now(), ...datos, fecha: new Date().toISOString() }]);
    this.enviado.set(datos.nombre.trim());
    setTimeout(() => this.confirmacion()?.nativeElement.focus());
  }

  protected nuevoMensaje(): void {
    this.form.reset();
    this.enviado.set(null);
    setTimeout(() => document.getElementById('nombre')?.focus());
  }
}
