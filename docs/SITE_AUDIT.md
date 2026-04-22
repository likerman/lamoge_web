# Auditoria Del Sitio LaMoGe

Fecha de revision: 2026-04-21

## Resumen ejecutivo

El sitio ya tiene una base correcta para un portal institucional bilingue:

- arquitectura Astro mantenible
- datos estructurados por seccion
- rutas `es` y `en`
- componentes compartidos reutilizables
- identidad visual consistente

La reorganizacion reciente mejora la lectura y el orden general, especialmente en:

- menu principal
- homepage mas enfocada
- estructura por areas institucionales
- gestion de integrantes con perfiles externos

## Cambios realizados en esta revision

- Reorganizacion del menu principal en:
  - `¿Quienes somos?`
  - `Investigacion`
  - `Formacion`
  - `Sociedad`
  - `Actualidad`
- Simplificacion de la pagina principal para dejar solo:
  - `¿Que es el LaMoGe?`
  - `Capacidades`
  - `Noticias`
- Ajuste del header para soportar submenu institucional coherente.
- Ajuste del footer para mostrar navegacion mas clara y menos redundante.
- Correccion del ancla `Volver arriba`.
- Pulido editorial en paginas institucionales principales para unificar tono ES/EN.
- Pulido editorial de segundo nivel en formacion, servicios, proyectos, publicaciones y actualidad.
- Incorporacion de enlaces externos verificados en perfiles de integrantes cuando hubo fuente publica confiable.
- Incorporacion de contacto publico verificado en integrantes cuando hubo fuente institucional disponible.
- Reemplazo de emails publicos en claro por formato ofuscado con `[at]` y eliminacion de `mailto:` expuestos.
- Enriquecimiento del archivo de noticias con hitos institucionales y de divulgacion con enlace de referencia.
- Optimizacion de imagenes clave usadas en home, heroes y noticias para reducir peso sin cambiar rutas publicas.
- Nueva pagina `404` institucional con accesos utiles, marca de `noindex` y soporte explicito en el deploy.
- Mejora de accesibilidad en `Contacto`:
  - labels reales en campos
  - enlaces clickeables para email
  - texto de ubicacion mas preciso
- Orden explicito de noticias por fecha descendente.
- Orden explicito de eventos por fecha ascendente.
- Mejora de accesibilidad en `Buscar` con label asociado.
- Documentacion de carga de perfiles `GitHub`, `Scholar` y `ORCID` por integrante.

## Estado actual por area

### 1. Integridad estructural

Estado: bueno

Fortalezas:

- La estructura de rutas cubre las secciones institucionales necesarias.
- El contenido dinamico vive en archivos unicos por seccion.
- El shell del sitio esta centralizado en layout + header + footer.

Riesgos o faltantes:

- Existen paginas legacy o parcialmente superpuestas (`lab`, `about`, `education`, `infrastructure`, `capabilities`) que todavia conviven.
- Algunas rutas tienen solapamiento conceptual y deberian consolidarse en una segunda etapa.

### 2. Lectura y claridad editorial

Estado: bueno, con margen de mejora

Fortalezas:

- La home ya no esta sobrecargada.
- Las secciones principales tienen mejor jerarquia visual.
- El sitio transmite mejor el caracter academico e institucional.

Faltantes:

- Algunas paginas todavia tienen demasiado texto introductorio y poca diferenciacion entre resumen institucional y detalle tecnico.
- Conviene revisar microcopy para unificar tono entre paginas antiguas y nuevas.

### 3. Orden e informacion

Estado: mejorado

Fortalezas:

- La navegacion principal responde a una estructura institucional clara.
- `Noticias` y `Eventos` quedaron separados.
- `Integrantes`, `Cursos`, `Doctorandos` y `Docencia` tienen rutas propias.

Faltantes:

- Haría una segunda pasada para decidir si `about` y `lab` deben convivir o si una debe redirigir a la otra.
- Tambien conviene decidir si `capabilities` e `infrastructure` quedan como dos paginas distintas o una principal y otra complementaria.

### 4. Accesibilidad

Estado: aceptable, aun incompleto

Mejoras aplicadas:

- `skip link`
- foco visible
- labels reales en formularios
- menus moviles mas estructurados
- search con label

Pendientes:

- revisar contraste real en todos los estados hover y dark panels
- probar navegacion completa solo con teclado
- validar lector de pantalla en menu con `details/summary`
- revisar orden de headings en todas las paginas

### 5. SEO y metadatos

Estado: correcto como base

Fortalezas:

- canonical
- alternates ES/EN
- Open Graph
- JSON-LD institucional

Pendientes:

- revisar titulos y descripciones para que no sean demasiado parecidos entre paginas
- generar imagenes OG institucionales consistentes por seccion
- agregar sitemap si no existe en el despliegue

### 6. Mantenibilidad interna

Estado: bueno

Fortalezas:

- cada seccion dinamica se edita en un solo JSON
- contenido bilingue centralizado
- documentacion de edicion agregada

Pendientes:

- idealmente validar esquemas de datos con Zod o `astro:content` mas estricto
- agregar convenciones editoriales para orden, campos opcionales y assets

### 7. Rendimiento

Estado: mejorado, todavia con margen de optimizacion

Observaciones:

- la arquitectura estatica es favorable
- se redujo el peso de imagenes principales ya publicadas en heroes y home
- todavia conviene revisar el resto de la galeria y evaluar pipeline mas estricto

Pendientes:

- convertir el resto de las imagenes pesadas de galeria a versiones optimizadas
- evaluar `astro:assets` o pipeline de imagenes
- correr Lighthouse real en produccion

## Recomendaciones prioritarias

### Alta prioridad

- definir si el formulario de contacto seguira con `mailto:` o si tendra backend real
- revisar si `education/` debe permanecer como landing de `Formacion` o redirigir a una pagina editorial mas sintetica
- validar el recorrido completo en produccion en ES y EN

### Prioridad media

- unificar tono editorial y terminologia institucional
- mejorar el buscador para evitar resultados repetidos o demasiado generales
- agregar logos/enlaces reales a perfiles de integrantes donde existan
- seguir completando perfiles externos solo con identificadores verificables para evitar enlaces incorrectos
- agregar estados vacios mas informativos en eventos, noticias y oportunidades

### Prioridad baja

- crear una pagina de 404 institucional
- sumar breadcrumbs en paginas internas largas
- preparar componentes mas ricos para publicaciones y proyectos destacados

## Estado de despliegue

La barrera de Node fue resuelta y el sitio ya pudo regenerarse con una version compatible de Node.

Consolidaciones aplicadas:

- `/{lang}/lab/` redirige a `/{lang}/about/`
- `/{lang}/infrastructure/` redirige a `/{lang}/capabilities/`
- `/{lang}/education/` redirige a `/{lang}/doctoral/`
- Header y footer usan rutas canonicas, no rutas de transicion

Eso reduce duplicacion sin romper URLs historicas.
