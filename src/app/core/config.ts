/** Constantes globales de la aplicación. */
import { Autor, Categoria } from '../models/noticia.model';

/** Ruta (relativa al <base href>) del JSON local con las noticias. */
export const RUTA_DATOS = 'data/noticias.json';

/** Claves de localStorage, con prefijo para evitar colisiones. */
export const CLAVES = {
  favoritos: 'nexo_favoritos',
  noticiasCreadas: 'nexo_noticias_creadas',
  noticiasEliminadas: 'nexo_noticias_eliminadas',
  mensajes: 'nexo_mensajes',
  suscriptores: 'nexo_suscriptores',
} as const;

export const CATEGORIAS: readonly Categoria[] = ['Política', 'Tecnología', 'Deportes', 'Cultura'];

export const ASUNTOS = [
  { valor: 'reporte', texto: 'Reporte ciudadano' },
  { valor: 'queja', texto: 'Queja' },
  { valor: 'sugerencia', texto: 'Sugerencia' },
  { valor: 'comercial', texto: 'Propuesta comercial' },
  { valor: 'comentario', texto: 'Comentario sobre una noticia' },
] as const;

export const IMAGENES = [
  { archivo: 'img/urbano-bogota.jpg', etiqueta: 'Ciudad al atardecer' },
  { archivo: 'img/peatonalizacion-centro.jpg', etiqueta: 'Plaza histórica' },
  { archivo: 'img/centro-innovacion.jpg', etiqueta: 'Centro de datos' },
  { archivo: 'img/ia-campo.jpg', etiqueta: 'Drones en el campo' },
  { archivo: 'img/ciberseguridad.jpg', etiqueta: 'Ciberseguridad' },
  { archivo: 'img/festival-bellas-artes.jpg', etiqueta: 'Danza folclórica' },
  { archivo: 'img/bienal-pintura.jpg', etiqueta: 'Galería de arte' },
  { archivo: 'img/atletismo.jpg', etiqueta: 'Atletismo' },
  { archivo: 'img/congreso-presupuesto.jpg', etiqueta: 'Congreso' },
  { archivo: 'img/infraestructura-agua.jpg', etiqueta: 'Presa y embalse' },
] as const;

/** Autor por defecto de las noticias creadas desde el panel de administración. */
export const AUTOR_REDACCION: Autor = {
  nombre: 'Redacción NexoNoticias',
  cargo: 'Equipo editorial',
  bio: 'Equipo de redacción de NexoNoticias: periodismo independiente, riguroso y comprometido con la verdad.',
};
