# LaMoGe Web

Sitio institucional bilingüe del Laboratorio de Modelado Geológico (LaMoGe), con fuente en Astro + TypeScript + Tailwind CSS y publicación estática en el directorio web normal del servidor.

## Estructura

- `site-src/`: código fuente del sitio Astro
- `apps/`: utilidades y páginas legacy del servidor
- `intranet/`: proyecto separado de intranet
- raíz del repo: archivos publicados por el servidor web en el puerto normal

## Flujo recomendado

1. Editar contenido y diseño dentro de `site-src/`
2. Compilar y publicar con:

```bash
./deploy-site.sh
```

3. Revisar en el sitio normal:

```text
/es/
/en/
```

## Cómo correr el proyecto en modo desarrollo

Si alguna vez necesitás el servidor de desarrollo:

```bash
cd site-src
npm install
npm run dev
```

No es necesario para publicar en el servidor web normal.

## Stack técnico

- `Astro` como framework estático liviano
- `TypeScript` para utilidades, tipado de contenido y páginas
- `Tailwind CSS` para estilos utilitarios
- contenido desacoplado en `site-src/src/content/` y `site-src/src/data/`
- despliegue simple en Vercel, Netlify o servidor institucional mediante build estático

## Branding y tipografía

- El logo real del laboratorio se detectó en `images/logo/lamoge_logo.pdf`.
- Para uso web se exportaron dos SVG en `site-src/public/brand/`:
  - `lamoge-mark.svg`: marca/isotipo
  - `lamoge-logo.svg`: wordmark horizontal
- Las fuentes del logo disponibles en `images/fonts/` no se cargan como webfonts globales del sitio.
- Decisión actual:
  - las tipografías originales quedan preservadas dentro del asset exportado del logo
  - la interfaz usa `IBM Plex Sans` y `IBM Plex Serif` como pareja web equivalente, más estable y legible para uso institucional continuo
- Si más adelante se quiere usar las fuentes originales en producción, conviene antes subsetearlas y autohospedarlas.

## Cómo editar textos

- Textos institucionales:
  - `site-src/src/content/es/site.json`
  - `site-src/src/content/en/site.json`
- Orden de secciones:
  - `sectionOrder` en ambos `site.json`

## Cómo agregar contenido nuevo

### Agregar un integrante

Editar `site-src/src/data/team.json` y sumar un objeto con esta estructura:

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

### Agregar una publicación

Editar `site-src/src/data/publications.json`.

- `featured: true` hace que aparezca en el bloque destacado.
- `featured: false` la envía al archivo filtrable con botón de “ver más”.
- `year`, `topic` y `type` alimentan automáticamente los filtros.

### Agregar una línea de investigación

Editar `site-src/src/data/research-lines.json`.

- `summary` aparece en la tarjeta.
- `detail` aparece en el bloque ampliable “Ver detalle”.
- `keywords` alimenta los chips de cada línea.

### Agregar un servicio

Editar `site-src/src/data/services.json`.

### Agregar una novedad

Editar `site-src/src/data/news.json`.

- `date` debe ir en formato `YYYY-MM-DD`.
- `category` se muestra como etiqueta.
- `url` es opcional; si existe, aparece un enlace de lectura.

### Agregar una imagen o video

1. Guardar el archivo en `site-src/public/images/` o una subcarpeta propia.
2. Referenciar la ruta pública desde el JSON correspondiente.
3. Para branding institucional, usar `site-src/public/brand/`.

## Qué archivo edita cada sección

- Qué hacemos: `site-src/src/data/activities.json`
- Líneas de investigación: `site-src/src/data/research-lines.json`
- Integrantes: `site-src/src/data/team.json`
- Publicaciones: `site-src/src/data/publications.json`
- Servicios: `site-src/src/data/services.json`
- Facilidades: `site-src/src/data/facilities.json`
- Galería: `site-src/src/data/gallery.json`
- Colaboraciones: `site-src/src/data/collaborations.json`
- Novedades: `site-src/src/data/news.json`
- Docencia y formación: `site-src/src/data/teaching.json`
- Preguntas frecuentes: `site-src/src/data/faq.json`

## Publicación

Ejecutar:

```bash
./deploy-site.sh
```

Ese script:

- compila el sitio con Astro
- publica `es/`, `en/`, `images/`, `icons/` y `/_astro/` en la raíz web
- intenta actualizar también `index.html`
- si no puede reemplazar la portada raíz por permisos, deja una copia en `lamoge-index.html`

## Siguiente etapa recomendada

- Validar textos institucionales definitivos
- Reemplazar placeholders por imágenes y videos reales
- Definir backend o servicio para el formulario de contacto
- Resolver explícitamente la relación entre `lamoge_web` e `intranet`
