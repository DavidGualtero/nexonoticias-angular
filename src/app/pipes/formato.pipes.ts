import { Pipe, PipeTransform } from '@angular/core';

const corto = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const largo = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

/** "2025-10-14T…" → "14 oct 2025" (se arma por partes para no depender del formato regional). */
@Pipe({ name: 'fechaCorta' })
export class FechaCortaPipe implements PipeTransform {
  transform(iso: string): string {
    const p = Object.fromEntries(corto.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
    return `${p['day']} ${String(p['month']).replace('.', '')} ${p['year']}`;
  }
}

/** "2025-10-14T…" → "14 de octubre de 2025" */
@Pipe({ name: 'fechaLarga' })
export class FechaLargaPipe implements PipeTransform {
  transform(iso: string): string {
    return largo.format(new Date(iso));
  }
}

/** "Mariana Ortega" → "MO" */
@Pipe({ name: 'iniciales' })
export class InicialesPipe implements PipeTransform {
  transform(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }
}
