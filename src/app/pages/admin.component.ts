import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ErrorCargaComponent } from '../components/error-carga.component';
import { CATEGORIAS, IMAGENES } from '../core/config';
import { estadoCampo, maximo, minimo, requerido } from '../core/validacion';
import { Categoria } from '../models/noticia.model';
import { FechaCortaPipe } from '../pipes/formato.pipes';
import { FavoritosService } from '../services/favoritos.service';
import { NoticiasService } from '../services/noticias.service';
import { ToastService } from '../services/toast.service';

/**
 * Mini CRUD de noticias (Create / Read / Delete) con formulario reactivo.
 * Panel demostrativo: sin autenticación; los cambios viven solo en el navegador.
 */
@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, ErrorCargaComponent, FechaCortaPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  protected readonly servicio = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;
  protected readonly autores = computed(() => [
    { clave: 'redaccion', texto: 'Redacción NexoNoticias' },
    ...Object.entries(this.servicio.autores()).map(([clave, a]) => ({ clave, texto: `${a.nombre} — ${a.cargo}` })),
  ]);

  protected readonly estado = estadoCampo;

  private readonly valoresIniciales = {
    titulo: '',
    categoria: CATEGORIAS[0] as Categoria,
    imagen: IMAGENES[0].archivo as string,
    autor: 'redaccion',
    resumen: '',
    contenido: '',
  };

  protected readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [requerido, minimo(10), maximo(120)] }),
    categoria: new FormControl<Categoria>(this.valoresIniciales.categoria, { nonNullable: true }),
    imagen: new FormControl(this.valoresIniciales.imagen, { nonNullable: true }),
    autor: new FormControl('redaccion', { nonNullable: true }),
    resumen: new FormControl('', { nonNullable: true, validators: [requerido, minimo(20), maximo(180)] }),
    contenido: new FormControl('', { nonNullable: true, validators: [requerido, minimo(60)] }),
  });

  /** CREATE */
  protected crear(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // El textarea del contenido usa id="cuerpo" (id="contenido" ya es el <main> de la página)
      const ids = { titulo: 'titulo', resumen: 'resumen', contenido: 'cuerpo' } as const;
      const primero = (Object.keys(ids) as (keyof typeof ids)[]).find((c) => this.form.controls[c].invalid);
      setTimeout(() => document.getElementById(primero ? ids[primero] : 'titulo')?.focus());
      return;
    }
    const d = this.form.getRawValue();
    this.servicio.crear({
      titulo: d.titulo.trim(),
      categoria: d.categoria,
      resumen: d.resumen.trim(),
      // Cada bloque separado por una línea en blanco se convierte en un párrafo
      contenido: d.contenido.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      imagen: d.imagen,
      autor: d.autor,
    });
    this.form.reset(this.valoresIniciales);
    this.toast.mostrar('Noticia creada correctamente');
  }

  /** DELETE */
  protected eliminar(id: number): void {
    if (!confirm('¿Eliminar esta noticia? Podrás restablecer los datos de ejemplo cuando quieras.')) return;
    this.servicio.eliminar(id);
    this.favoritos.quitar(id); // evita favoritos "fantasma"
    this.toast.mostrar('Noticia eliminada');
  }

  protected restablecer(): void {
    if (!confirm('Se borrarán las noticias creadas y se recuperarán las eliminadas. ¿Continuar?')) return;
    this.servicio.restablecer();
    this.toast.mostrar('Datos de ejemplo restablecidos');
  }
}
