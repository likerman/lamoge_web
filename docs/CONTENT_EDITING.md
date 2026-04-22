# Edicion De Contenido

Esta guia resume como mantener el sitio institucional sin tocar multiples archivos.

## Donde editar

- Navegacion, hero, microcopy del encabezado y footer:
  - `site-src/src/content/es/site.json`
  - `site-src/src/content/en/site.json`
- Secciones dinamicas:
  - `site-src/src/data/news.json`
  - `site-src/src/data/events.json`
  - `site-src/src/data/publications.json`
  - `site-src/src/data/projects.json`
  - `site-src/src/data/team.json`
  - `site-src/src/data/services.json`
  - `site-src/src/data/facilities.json`
  - `site-src/src/data/collaborations.json`
  - `site-src/src/data/downloads.json`
  - `site-src/src/data/opportunities.json`

Cada seccion se edita en un archivo unico para evitar duplicacion manual.

## Reglas practicas

- Mantener siempre los dos idiomas cuando el campo use formato `{ "es": "...", "en": "..." }`.
- Usar fechas en formato `YYYY-MM-DD`.
- Reutilizar imagenes en `site-src/public/images/...`.
- Para publicaciones, completar `doi` y `url` cuando existan.
- Para proyectos, marcar `featured: true` solo en los que deban aparecer destacados.
- Para noticias y eventos, los registros mas recientes deben quedar primero.

## Esquemas rapidos

### Noticia

```json
{
  "date": "2026-04-21",
  "category": { "es": "Institucional", "en": "Institutional" },
  "title": { "es": "Titulo", "en": "Title" },
  "summary": { "es": "Resumen breve", "en": "Short summary" },
  "image": "/images/gallery/archivo.jpg",
  "url": "https://..."
}
```

### Evento

```json
{
  "id": "seminario-modelado-2026",
  "date": "2026-06-20",
  "place": { "es": "Buenos Aires", "en": "Buenos Aires" },
  "title": { "es": "Titulo", "en": "Title" },
  "description": { "es": "Descripcion", "en": "Description" },
  "category": { "es": "Seminario", "en": "Seminar" },
  "registrationUrl": "https://..."
}
```

### Publicacion

```json
{
  "featured": true,
  "year": 2025,
  "type": "article",
  "topic": "kinematic-modelling",
  "title": "Paper title",
  "authors": "Apellido, N.; Apellido, N.",
  "journal": "Journal name",
  "doi": "10.xxxx/xxxx",
  "url": "https://doi.org/..."
}
```

### Proyecto

```json
{
  "id": "proyecto-tectonica-andina",
  "featured": true,
  "status": { "es": "Linea activa", "en": "Active line" },
  "period": "2024-present",
  "title": { "es": "Titulo", "en": "Title" },
  "summary": { "es": "Resumen", "en": "Summary" },
  "partners": ["IDEAN", "UBA", "CONICET"],
  "tags": {
    "es": ["tectonica", "modelado"],
    "en": ["tectonics", "modelling"]
  }
}
```

### Integrante

```json
{
  "category": "researchers",
  "name": "Dra. Nombre Apellido",
  "role": { "es": "Investigadora", "en": "Researcher" },
  "affiliation": "IDEAN · UBA · CONICET",
  "area": { "es": "Area de trabajo", "en": "Research area" },
  "bio": { "es": "Bio breve", "en": "Short bio" },
  "email": "correo [at] institucion.org",
  "photo": "/images/placeholders/team-1.svg",
  "links": [
    { "platform": "github", "label": "GitHub", "url": "https://github.com/usuario" },
    { "platform": "scholar", "label": "Scholar", "url": "https://scholar.google.com/..." },
    { "platform": "orcid", "label": "ORCID", "url": "https://orcid.org/..." }
  ]
}
```

Valores recomendados para `platform`:

- `github`
- `scholar`
- `google-scholar`
- `orcid`

## Emails publicos

- No publicar emails en formato plano con `@`.
- Usar siempre el formato ofuscado `usuario [at] dominio.org`.
- No usar enlaces `mailto:` mientras no exista una estrategia anti-spam o backend institucional.

## Flujo de publicacion

1. Editar archivos dentro de `site-src/`.
2. Ejecutar `cd site-src && npm run build`.
3. Si el build termina sin errores, publicar con `./deploy-site.sh`.
