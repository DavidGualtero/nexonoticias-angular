# NexoNoticias (Angular)

Plataforma web de noticias — **Entrega final (Semana 7)** del módulo *Desarrollo de Front-end*.
Migración a **Angular 21** del prototipo en HTML/CSS/JavaScript, conservando el diseño de la maquetación en Figma.

- **Aplicación desplegada:** `https://davidgualtero.github.io/nexonoticias-angular/`

## Qué incluye

| Página | Ruta | Descripción |
|---|---|---|
| Inicio | `/#/` | Hero, destacados desde el JSON, cita con estadísticas animadas, boletín |
| Catálogo | `/#/noticias` | Búsqueda y filtro por categoría (reflejados en la URL) |
| Detalle | `/#/noticias/:id` | Artículo, reportero, publicidad y relacionadas |
| Favoritos | `/#/favoritos` | Lista guardada en `localStorage` |
| Contacto | `/#/contacto` | Formulario reactivo con validaciones y confirmación |
| Admin | `/#/admin` | Mini CRUD: crear y eliminar noticias |

**Angular aplicado:** componentes standalone, plantillas con binding (`{{ }}`, `[prop]`, `(evento)`, `[(ngModel)]`),
control de flujo (`@if`, `@for`), `input()` / `output()`, signals y `computed`, servicios con `inject()`,
pipes, una directiva de atributo, formularios reactivos, `HttpClient` y enrutador con carga diferida.

## Ejecutar en local

Requiere **Node.js 22.12+** (o 20.19+) y npm.

```bash
npm install     # instala dependencias (una sola vez)
npm start       # http://localhost:4200
npm run build   # compilación de producción -> dist/nexonoticias/browser
```

## Estructura

```
public/data/noticias.json   fuente de datos (autores y noticias)
public/img/                 fotografías
src/styles.css              estilos globales (diseño de Figma)
src/app/
  app.ts / app.html         componente raíz
  app.routes.ts             rutas (lazy loading)
  app.config.ts             router, HttpClient
  models/                   interfaces TypeScript
  core/                     config, storage, validación
  services/                 Noticias, Favoritos, Toast, Boletín
  components/               Header, Footer, Tarjeta, Toasts, Icono, ErrorCarga
  pages/                    las seis páginas
  pipes/  directives/       fechaCorta, fechaLarga, iniciales · appContador
```

## Datos y persistencia

Las noticias se leen de `public/data/noticias.json` (nunca se modifica). Favoritos, noticias creadas o eliminadas,
mensajes de contacto y suscriptores se guardan en `localStorage` (claves `nexo_*`).
El botón **Restablecer datos de ejemplo** del panel Admin recupera el estado inicial.

## Autor

Juan David Gualtero · Docente: John Olarte Ramos
