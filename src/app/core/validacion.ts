/**
 * Validadores y mensajes para los formularios reactivos.
 * Los validadores aplican trim() para que un campo con solo espacios cuente como vacío.
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const requerido: ValidatorFn = (c) => (String(c.value ?? '').trim() === '' ? { requerido: true } : null);

export const minimo = (n: number): ValidatorFn => (c) =>
  String(c.value ?? '').trim().length >= n ? null : { minimo: n };

export const maximo = (n: number): ValidatorFn => (c) =>
  String(c.value ?? '').trim().length <= n ? null : { maximo: n };

export const correo: ValidatorFn = (c): ValidationErrors | null =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(c.value ?? '').trim()) ? null : { correo: true };

/** true si el texto es un correo válido (para formularios sin FormControl). */
export const esCorreo = (valor: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());

/** El campo se considera "con error visible" solo después de interactuar con él. */
export const mostrarError = (c: AbstractControl): boolean => c.invalid && (c.touched || c.dirty);

/** Mensaje de error legible del primer validador que falle. */
export function mensajeError(c: AbstractControl): string | null {
  const e = c.errors;
  if (!e) return null;
  if (e['requerido']) return 'Campo vacío';
  if (e['minimo']) return `Mínimo ${e['minimo']} caracteres`;
  if (e['maximo']) return `Máximo ${e['maximo']} caracteres`;
  if (e['correo']) return 'Correo no válido';
  return 'Valor no válido';
}

/** Texto y estado del indicador a la derecha de cada etiqueta. */
export function estadoCampo(c: AbstractControl): { texto: string; error: boolean } {
  if (mostrarError(c)) return { texto: mensajeError(c) ?? '', error: true };
  if ((c.touched || c.dirty) && c.valid) return { texto: '✓ Correcto', error: false };
  return { texto: '* Requerido', error: false };
}
