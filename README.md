# LaMoGe Web

Sitio institucional bilingue del Laboratorio de Modelado Geologico (LaMoGe), construido con Astro y publicado como sitio estatico en la raiz web del servidor.

## Stack y arquitectura

- `site-src/`: fuente del sitio Astro
- `site-src/src/content/es/site.json` y `site-src/src/content/en/site.json`: textos institucionales globales de cada idioma
- `site-src/src/data/*.json`: colecciones editables para contenido dinamico
- `apps/`: utilidades y paginas legacy del servidor
- `intranet/`: proyecto separado de intranet
- raiz del repo: salida publicada por el servidor web

## Rutas publicas principales

- `/es/`
- `/en/`
- `/{lang}/lab/`
- `/{lang}/research/`
- `/{lang}/team/`
- `/{lang}/publications/`
- `/{lang}/projects/`
- `/{lang}/services/`
- `/{lang}/infrastructure/`
- `/{lang}/news/`
- `/{lang}/contact/`
- `/{lang}/search/`

La navegacion institucional principal se organiza alrededor de:

- Inicio
- ¿Quienes somos?
- Investigacion
- Formacion
- Sociedad
- Actualidad

Subpaginas clave:

- ¿Quienes somos?: `what-we-do`, `team`, `contact`
- Investigacion: `research-lines`, `capabilities`, `publications`, `projects`
- Formacion: `doctoral`, `courses`, `teaching`
- Actualidad: `events`, `news`

Las rutas legacy `/about/`, `/education/`, `/society/` y `/gallery/` se mantienen mediante redireccion al nuevo mapa institucional.

## Flujo recomendado

1. Editar contenido o diseno dentro de `site-src/`
2. Verificar localmente:

```bash
cd site-src
npm run build
```

3. Publicar:

```bash
./deploy-site.sh
```

## Diseno y front-end

- Tipografias web: `Sora` para titulos y `Public Sans` para texto corrido
- Sistema visual con tokens en `site-src/src/styles/global.css`
- Shell comun en:
  - `site-src/src/layouts/BaseLayout.astro`
  - `site-src/src/components/Header.astro`
  - `site-src/src/components/Footer.astro`
  - `site-src/src/components/LanguageSwitcher.astro`
  - `site-src/src/components/HeroSection.astro`
  - `site-src/src/components/PageHero.astro`

## Edicion de contenido

Guia resumida para edicion interna:

- textos globales y navegacion bilingue: `site-src/src/content/es/site.json` y `site-src/src/content/en/site.json`
- contenido dinamico por seccion: `site-src/src/data/*.json`
- documentacion detallada para edicion no tecnica: [docs/CONTENT_EDITING.md](/home/jl/LaMoGe/var/www/html/docs/CONTENT_EDITING.md)

### Textos institucionales bilingues

- `site-src/src/content/es/site.json`
- `site-src/src/content/en/site.json`

Editar estos archivos para:

- nombres de navegacion
- microcopy institucional
- hero global
- tagline de footer
- etiquetas del shell

### Colecciones editables

Cada seccion dinamica se edita en un solo archivo JSON:

- actividades metodologicas: `site-src/src/data/activities.json`
- lineas de investigacion: `site-src/src/data/research-lines.json`
- integrantes: `site-src/src/data/team.json`
- publicaciones: `site-src/src/data/publications.json`
- proyectos: `site-src/src/data/projects.json`
- servicios: `site-src/src/data/services.json`
- infraestructura: `site-src/src/data/facilities.json`
- colaboraciones: `site-src/src/data/collaborations.json`
- noticias: `site-src/src/data/news.json`
- eventos: `site-src/src/data/events.json`
- convocatorias: `site-src/src/data/opportunities.json`
- descargas: `site-src/src/data/downloads.json`
- galeria: `site-src/src/data/gallery.json`
- docencia: `site-src/src/data/teaching.json`
- preguntas frecuentes: `site-src/src/data/faq.json`

## Esquemas de contenido

### Publicacion

Archivo: `site-src/src/data/publications.json`

```json
{
  "featured": true,
  "year": 2025,
  "type": "article",
  "topic": "kinematic-modelling",
  "tags": ["tectonics", "modelling"],
  "title": "Titulo",
  "authors": "Apellido, N.; Apellido, N.",
  "journal": "Revista",
  "doi": "10.xxxx/xxxx",
  "url": "https://doi.org/..."
}
```

### Noticia

Archivo: `site-src/src/data/news.json`

```json
{
  "date": "2026-04-21",
  "category": {
    "es": "Institucional",
    "en": "Institutional"
  },
  "title": {
    "es": "Titulo",
    "en": "Title"
  },
  "summary": {
    "es": "Resumen breve",
    "en": "Short summary"
  },
  "image": "/images/...",
  "url": "https://..."
}
```

### Evento

Archivo: `site-src/src/data/events.json`

```json
{
  "id": "seminario-1",
  "date": "2026-06-20",
  "place": {
    "es": "Buenos Aires",
    "en": "Buenos Aires"
  },
  "title": {
    "es": "Titulo del evento",
    "en": "Event title"
  },
  "description": {
    "es": "Descripcion",
    "en": "Description"
  },
  "category": {
    "es": "Seminario",
    "en": "Seminar"
  },
  "registrationUrl": "https://..."
}
```

### Proyecto

Archivo: `site-src/src/data/projects.json`

```json
{
  "id": "project-id",
  "featured": true,
  "status": {
    "es": "Linea activa",
    "en": "Active line"
  },
  "period": "2024-present",
  "title": {
    "es": "Titulo",
    "en": "Title"
  },
  "summary": {
    "es": "Resumen",
    "en": "Summary"
  },
  "partners": ["IDEAN", "UBA"],
  "tags": {
    "es": ["tectonica", "modelado"],
    "en": ["tectonics", "modelling"]
  },
  "image": "/images/...",
  "url": "https://..."
}
```

### Integrante

Archivo: `site-src/src/data/team.json`

```json
{
  "category": "researchers",
  "name": "Dra. Nombre Apellido",
  "role": {
    "es": "Investigadora",
    "en": "Researcher"
  },
  "affiliation": "IDEAN · UBA · CONICET",
  "area": {
    "es": "Area de trabajo",
    "en": "Research area"
  },
  "bio": {
    "es": "Bio breve",
    "en": "Short bio"
  },
  "email": "correo@institucion.org",
  "photo": "/images/placeholders/team-1.svg",
  "links": [
    {
      "label": "ORCID",
      "url": "https://orcid.org/..."
    }
  ]
}
```

## Como agregar contenido

### Agregar una publicacion

1. Editar `site-src/src/data/publications.json`
2. Completar `year`, `topic` y `type`
3. Marcar `featured: true` si debe aparecer en destacados

### Agregar una noticia

1. Editar `site-src/src/data/news.json`
2. Usar `date` en formato `YYYY-MM-DD`
3. Agregar `image` si la noticia necesita soporte visual

### Agregar un proyecto

1. Editar `site-src/src/data/projects.json`
2. Completar `status`, `period`, `partners` y `tags`
3. Definir `featured: true` si debe aparecer en portada

### Agregar un evento o una convocatoria

- eventos: `site-src/src/data/events.json`
- convocatorias: `site-src/src/data/opportunities.json`

Si no hay elementos publicados, el sitio mostrara un estado vacio elegante sin romper el layout.

### Agregar una descarga

1. Guardar el archivo dentro de `site-src/public/`
2. Crear una entrada en `site-src/src/data/downloads.json`
3. Referenciar la ruta publica en `file`

## SEO y multilenguaje

- estructura bilingue estable en `/es/` y `/en/`
- `canonical` y `hreflang` generados desde `BaseLayout.astro`
- `site` configurado en `site-src/astro.config.mjs`
- `LanguageSwitcher.astro` conserva la ruta actual al cambiar idioma

## Publicacion

Ejecutar:

```bash
./deploy-site.sh
```

Ese script:

- compila el sitio con Astro
- publica `es/`, `en/`, `images/`, `icons/`, `brand/` y `/_astro/` en la raiz web
- intenta actualizar tambien `index.html`
- si no puede reemplazar la portada raiz por permisos, deja una copia en `lamoge-index.html`

## Pendiente recomendado

- conectar el formulario de contacto a un backend institucional o servicio de formularios aprobado
- cargar enlaces oficiales de GitHub, Google Scholar y ORCID en el header/footer si el laboratorio define perfiles institucionales
- reemplazar placeholders fotograficos de integrantes por retratos reales
- poblar `events.json` y `opportunities.json` cuando haya agenda o convocatorias publicas
# idean_web
