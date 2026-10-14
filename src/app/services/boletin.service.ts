import { Injectable } from '@angular/core';
import { CLAVES } from '../core/config';
import { guardar, leer } from '../core/storage';
import { esCorreo } from '../core/validacion';

/** Suscripción al boletín: valida el correo y lo guarda en localStorage. */
@Injectable({ providedIn: 'root' })
export class BoletinService {
  /** Devuelve true si el correo era válido y quedó registrado. */
  suscribir(correo: string): boolean {
    if (!esCorreo(correo)) return false;
    const lista = leer<string[]>(CLAVES.suscriptores, []);
    const limpio = correo.trim().toLowerCase();
    if (!lista.includes(limpio)) guardar(CLAVES.suscriptores, [...lista, limpio]);
    return true;
  }
}
