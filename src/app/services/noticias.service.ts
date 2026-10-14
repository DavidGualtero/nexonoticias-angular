import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { AUTOR_REDACCION, CLAVES, RUTA_DATOS } from '../core/config';
import { borrar, guardar, leer } from '../core/storage';
import { Autor, DatosNoticias, Noticia, NuevaNoticia } from '../models/noticia.model';

/**
 * Fuente única de datos de noticias.
 * Base: data/noticias.json (HttpClient). Sobre esa base se aplica el mini CRUD
 * guardado en localStorage:  visibles = (creadas + base) − eliminadas.
 * El estado vive en signals: cualquier componente que los lea se actualiza solo.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);

  private readonly base = signal<DatosNoticias | null>(null);
  private readonly creadas = signal<Noticia[]>(leer<Noticia[]>(CLAVES.noticiasCreadas, []));
  private readonly eliminadas = signal<number[]>(leer<number[]>(CLAVES.noticiasEliminadas, []));

  /** Mensaje de error si falló la carga del JSON. */
  readonly error = signal<string | null>(null);
  readonly cargando = computed(() => this.base() === null && this.error() === null);

  /** Noticias visibles, de la más reciente a la más antigua. */
  readonly noticias = computed<Noticia[]>(() => {
    const datos = this.base();
    if (!datos) return [];
    const eliminadas = this.eliminadas();
    return [...this.creadas(), ...datos.noticias]
      .filter((n) => !eliminadas.includes(n.id))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  readonly autores = computed<Record<string, Autor>>(() => this.base()?.autores ?? {});

  constructor() {
    this.cargar();
  }

  /** Descarga el JSON base. Se puede reintentar llamando de nuevo. */
  cargar(): void {
    this.error.set(null);
    this.http.get<DatosNoticias>(RUTA_DATOS).subscribe({
      next: (datos) => this.base.set(datos),
      error: (e: { status?: number }) =>
        this.error.set(`No se pudo cargar ${RUTA_DATOS} (${e.status ? 'HTTP ' + e.status : 'sin conexión'})`),
    });
  }

  obtener(id: number): Noticia | undefined {
    return this.noticias().find((n) => n.id === id);
  }

  autor(clave: string): Autor {
    return this.autores()[clave] ?? AUTOR_REDACCION;
  }

  esCreada(id: number): boolean {
    return this.creadas().some((n) => n.id === id);
  }

  /** CREATE */
  crear(datos: NuevaNoticia): Noticia {
    const nueva: Noticia = { ...datos, id: Date.now(), fecha: new Date().toISOString(), destacada: false };
    this.creadas.update((lista) => [nueva, ...lista]);
    guardar(CLAVES.noticiasCreadas, this.creadas());
    return nueva;
  }

  /** DELETE (creadas: se borran; del JSON: se marcan como eliminadas) */
  eliminar(id: number): void {
    if (this.esCreada(id)) {
      this.creadas.update((lista) => lista.filter((n) => n.id !== id));
      guardar(CLAVES.noticiasCreadas, this.creadas());
    } else {
      this.eliminadas.update((lista) => [...lista, id]);
      guardar(CLAVES.noticiasEliminadas, this.eliminadas());
    }
  }

  /** Vuelve al estado inicial de los datos de ejemplo. */
  restablecer(): void {
    this.creadas.set([]);
    this.eliminadas.set([]);
    borrar(CLAVES.noticiasCreadas);
    borrar(CLAVES.noticiasEliminadas);
  }
}
