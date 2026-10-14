import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: 'ok' | 'error';
}

/** Avisos emergentes temporales (los pinta ToastsComponent). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private contador = 0;

  mostrar(mensaje: string, tipo: Toast['tipo'] = 'ok'): void {
    const toast: Toast = { id: ++this.contador, mensaje, tipo };
    this.toasts.update((lista) => [...lista, toast]);
    setTimeout(() => this.toasts.update((lista) => lista.filter((t) => t.id !== toast.id)), 3200);
  }
}
