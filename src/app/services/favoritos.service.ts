import { Injectable, computed, signal } from '@angular/core';
import { CLAVES } from '../core/config';
import { guardar, leer } from '../core/storage';

/** Gestión de favoritos persistida en localStorage. Expone el estado como signals. */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  readonly ids = signal<number[]>(leer<number[]>(CLAVES.favoritos, []));
  readonly total = computed(() => this.ids().length);

  esFavorito(id: number): boolean {
    return this.ids().includes(id);
  }

  /** Agrega o quita; devuelve true si la noticia quedó guardada. */
  alternar(id: number): boolean {
    const guardada = !this.esFavorito(id);
    this.ids.update((lista) => (guardada ? [...lista, id] : lista.filter((x) => x !== id)));
    guardar(CLAVES.favoritos, this.ids());
    return guardada;
  }

  quitar(id: number): void {
    if (!this.esFavorito(id)) return;
    this.ids.update((lista) => lista.filter((x) => x !== id));
    guardar(CLAVES.favoritos, this.ids());
  }

  vaciar(): void {
    this.ids.set([]);
    guardar(CLAVES.favoritos, []);
  }
}
