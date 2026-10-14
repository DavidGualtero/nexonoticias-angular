/** Modelos de datos de la aplicación (tipado de data/noticias.json). */

export type Categoria = 'Política' | 'Tecnología' | 'Deportes' | 'Cultura';

export interface Autor {
  nombre: string;
  cargo: string;
  bio: string;
}

export interface Noticia {
  id: number;
  titulo: string;
  categoria: Categoria;
  /** Etiqueta opcional que se muestra en lugar de la categoría (p. ej. "Política & Sociedad"). */
  etiqueta?: string;
  /** Fecha en formato ISO 8601. */
  fecha: string;
  resumen: string;
  /** Cada elemento es un párrafo. */
  contenido: string[];
  imagen: string;
  /** Clave del autor dentro de `autores` (o "redaccion"). */
  autor: string;
  destacada: boolean;
}

/** Estructura del archivo JSON. */
export interface DatosNoticias {
  autores: Record<string, Autor>;
  noticias: Noticia[];
}

/** Datos que el panel Admin envía para crear una noticia. */
export type NuevaNoticia = Omit<Noticia, 'id' | 'fecha' | 'destacada' | 'etiqueta'>;

export interface MensajeContacto {
  id: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  fecha: string;
}
