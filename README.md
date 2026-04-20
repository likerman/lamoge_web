# LaMoGe Web

Primera versión del sitio institucional bilingüe del Laboratorio de Modelado Geológico (LaMoGe), pensado para crecer con contenido editable por Git y una arquitectura estática liviana.

## Arquitectura

- Framework: `Astro`
- Idiomas: `es` y `en`
- Layout y componentes: `src/layouts/` y `src/components/`
- Textos institucionales por idioma: `src/content/es/site.json` y `src/content/en/site.json`
- Datos editables del sitio: `src/data/*.json`
- Imágenes y placeholders públicos: `public/images/`

## Cómo correr el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar entorno local:

```bash
npm run dev
```

3. Abrir en navegador la URL que indique Astro, normalmente `http://localhost:4321`.

## Cómo editar textos

- Textos de navegación, hero, títulos de sección, contacto y footer:
  - `src/content/es/site.json`
  - `src/content/en/site.json`
- Para cambiar el orden de las secciones:
  - editar el arreglo `sectionOrder` en ambos archivos `site.json`

## Cómo agregar contenido nuevo

### Agregar un integrante

Editar `src/data/team.json` y sumar un objeto con esta estructura:

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
    "es": "Área de trabajo",
    "en": "Research area"
  },
  "email": "correo@institucion.org",
  "photo": "/images/placeholders/team-1.svg",
  "links": [
    {
      "label": "ORCID",
      "url": "https://orcid.org/"
    }
  ]
}
```

Categorías sugeridas: `leadership`, `researchers`, `fellows`, `students`, `collaborators`.

### Agregar una publicación

Editar `src/data/publications.json` y sumar un objeto:

```json
{
  "featured": true,
  "year": 2026,
  "type": "article",
  "topic": "tectonics",
  "title": "Título de la publicación",
  "authors": "Apellido, N.; Apellido, N.",
  "journal": "Nombre de revista o evento",
  "doi": "10.xxxx/xxxxx",
  "url": "https://doi.org/..."
}
```

### Agregar una línea de investigación

Editar `src/data/research-lines.json`:

```json
{
  "title": {
    "es": "Título en español",
    "en": "Title in English"
  },
  "summary": {
    "es": "Resumen breve en español",
    "en": "Short summary in English"
  },
  "keywords": {
    "es": ["palabra clave 1", "palabra clave 2"],
    "en": ["keyword 1", "keyword 2"]
  },
  "image": "/images/placeholders/research-1.svg"
}
```

### Agregar un servicio

Editar `src/data/services.json`:

```json
{
  "title": {
    "es": "Nombre del servicio",
    "en": "Service name"
  },
  "summary": {
    "es": "Descripción breve",
    "en": "Short description"
  },
  "audience": {
    "es": "A quién está dirigido",
    "en": "Target audience"
  },
  "applications": {
    "es": ["aplicación 1", "aplicación 2"],
    "en": ["application 1", "application 2"]
  },
  "status": {
    "es": "Disponible bajo consulta",
    "en": "Available on request"
  }
}
```

### Agregar una imagen o video

1. Guardar el archivo en `public/images/` o en una subcarpeta propia.
2. Referenciar la ruta pública desde el JSON correspondiente, por ejemplo:

```json
"/images/laboratorio/foto-01.jpg"
```

Para la galería, editar `src/data/gallery.json`.

## Qué archivo edita cada sección

- Qué hacemos: `src/data/activities.json`
- Líneas de investigación: `src/data/research-lines.json`
- Integrantes: `src/data/team.json`
- Publicaciones: `src/data/publications.json`
- Servicios: `src/data/services.json`
- Facilidades: `src/data/facilities.json`
- Galería: `src/data/gallery.json`
- Colaboraciones: `src/data/collaborations.json`
- Docencia y formación: `src/data/teaching.json`
- Preguntas frecuentes: `src/data/faq.json`

## Despliegue

Generar la versión estática:

```bash
npm run build
```

Astro genera la carpeta `dist/`. Esa carpeta puede publicarse en cualquier hosting estático o integrarse luego con un flujo de despliegue automatizado.

## Siguiente etapa recomendada

- Reemplazar placeholders por textos institucionales validados.
- Cambiar imágenes de ejemplo por fotos y videos reales del laboratorio.
- Definir la estrategia del formulario de contacto.
- Configurar dominio final y actualizar `site` en `astro.config.mjs`.
- Si se quiere edición más simple, integrar luego un CMS liviano o Git-based sin rehacer la estructura.
