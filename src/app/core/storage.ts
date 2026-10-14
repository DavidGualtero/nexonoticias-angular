/**
 * Envoltorio seguro sobre localStorage: si el navegador bloquea el
 * almacenamiento (modo privado, cuota llena) la app sigue funcionando.
 */

/** Lee y parsea un valor JSON; devuelve `porDefecto` si no existe o falla. */
export function leer<T>(clave: string, porDefecto: T): T {
  try {
    const bruto = localStorage.getItem(clave);
    return bruto === null ? porDefecto : (JSON.parse(bruto) as T);
  } catch {
    return porDefecto;
  }
}

/** Guarda un valor como JSON. Devuelve true si tuvo éxito. */
export function guardar(clave: string, valor: unknown): boolean {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function borrar(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch {
    /* almacenamiento no disponible: sin acción */
  }
}
