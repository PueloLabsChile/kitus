# Kitus

Periódico político digital. Medio de "ideas de cambio" que da visibilidad a los
sectores minorizados por los grandes medios.

- Canal de YouTube: <https://www.youtube.com/@kitusonline6343>
- Identidad tomada del canal: "K" roja dentro de un círculo + "ITUS" en negro,
  lema *ideas de cambio*, paleta rojo `#C1272D` / tinta / papel, serif editorial
  (Playfair Display + Inter).

Sitio hecho con **Astro** (genera HTML estático) + **Decap CMS** para que la
redacción cargue notas desde un panel web sin tocar código.

---

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:4321
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` para revisar el resultado final |
| `npm run cms` | Proxy local del CMS (para editar en `/admin/` sin login) |

### Editar notas en local

En una terminal `npm run cms` y en otra `npm run dev`, después abrir
<http://localhost:4321/admin/>. No pide usuario ni contraseña: los cambios se
escriben directo en los archivos de `src/content/`.

---

## Estructura

```
src/
├── consts.ts                 Nombre del sitio, secciones, YouTube, flag "prototipo"
├── content.config.ts         Esquema de las notas y de los autores
├── content/
│   ├── articulos/*.md        Una nota por archivo (frontmatter + texto)
│   └── autores/*.md          Fichas de autor/a
├── components/               Masthead, Nav, Pie, TarjetaArticulo, Agenda, Boletin, FranjaMultimedia
├── layouts/                  Base.astro (envoltura común)
├── pages/
│   ├── index.astro           Portada (se arma sola con las notas)
│   ├── [seccion].astro       /politica, /economia, ... (una por sección)
│   ├── articulo/[slug].astro  Página de nota
│   ├── quienes-somos.astro
│   ├── multimedia.astro
│   └── rss.xml.js            Feed RSS
├── data/
│   ├── videos.json           Videos del canal (lo actualiza el script)
│   └── agenda.json           Titulares de otros medios (lo actualiza el script)
└── styles/global.css         Toda la hoja de estilo

scripts/
├── actualizar.mjs            Trae videos + agenda (sin dependencias)
└── fuentes.json              Canal de YouTube y feeds RSS a seguir  ← EDITAR

.github/workflows/
└── actualizar.yml            Corre el script cada 8 h y hace commit si algo cambió

public/
├── admin/                    Decap CMS (index.html + config.yml)
├── uploads/                  Miniaturas de video + imágenes subidas desde el panel
├── logo-kitus.svg
└── favicon.svg

_prototipo-estatico/          Primer prototipo en HTML plano (referencia, no se usa)
```

### Cómo se arma la portada

La portada, las secciones, el RSS y el listado de "Lo último" se generan solos a
partir de las notas de `src/content/articulos/`. Solo hay que crear la nota.

- `destacada: true` → va grande como nota de tapa.
- `opinion: true` → va en la columna "Opinión" de la portada y en la sección Opinión.
- `borrador: true` → no se publica.

---

## Contenido que se actualiza solo

Además de las notas propias, el sitio se llena solo de dos formas, **sin IA,
sin API keys y sin costo**:

| Qué | De dónde sale | Dónde queda |
|---|---|---|
| Franja **Multimedia** y página `/multimedia` | Últimos videos del canal de YouTube | `src/data/videos.json` |
| **Notas completas republicadas** de medios con licencia Creative Commons | Feeds RSS de `scripts/fuentes.json` → `sindicadas` | `src/content/articulos/sind__*.md` |

**Notas sindicadas.** El script `scripts/actualizar.mjs` baja las últimas notas de
cada medio de la lista `sindicadas`, convierte el HTML a Markdown y las guarda como
páginas normales de Kitus (prefijo `sind__`), con la sección adivinada por palabras
clave. Cada una lleva la firma original, un recuadro con la licencia y el enlace a
la nota original; **el texto no se modifica**. Entran en la portada y en su sección
como cualquier nota. Solo se agregan medios cuya licencia permita la reproducción
(por ahora: Global Voices, Pressenza, Agencia Tierra Viva).

- Si el `.md` ya existe, no se pisa (la redacción puede corregir sección, bajada, etc.).
- Las que salen de todos los feeds y superan `diasQueSeConservan` (45) se borran solas.
- Para editar la lista: `scripts/fuentes.json` → `sindicadas` (medio, url, home,
  licencia, licenciaUrl, maxPorFeed).

**Cómo corre.** `npm run actualizar` a mano, o el workflow
`.github/workflows/actualizar.yml` **cada 8 h** en GitHub Actions (tramo gratuito):
si algo cambió, hace commit y eso dispara el redeploy. También desde la pestaña
*Actions* → *Run workflow*.

> **Notas redactadas por IA** (síntesis propias, "Panorama del día"): no están
> activadas —requieren una API key de pago—. El enganche queda para cuando haya
> presupuesto o periodistas. Hoy el contenido automático es: videos del canal +
> notas republicadas con licencia.

---

## Publicar en un hosting con cPanel

El sitio es **HTML estático**: se compila en tu máquina y se sube la carpeta
resultante. Con `build.format: 'directory'` en `astro.config.mjs` cada página es
`carpeta/index.html`, así que Apache la sirve sin reglas de reescritura.

1. **Compilar:** `npm run build` → todo queda en `dist/` (incluido `dist/.htaccess`,
   que se copia desde `public/.htaccess`).
2. **Empaquetar:** seleccionar **el contenido** de `dist/` (no la carpeta `dist`
   en sí), click derecho → *Comprimir* → `kitus.zip`.
3. **Subir:** en cPanel → *Administrador de archivos* → entrar a `public_html/`
   (borrar lo que haya de una versión anterior) → *Cargar* `kitus.zip` →
   *Extraer*. Verificar que `.htaccess` quedó en `public_html/` (activar "Mostrar
   archivos ocultos" en Configuración del administrador de archivos).
4. **Dominio:** apuntar el dominio a ese hosting y ponerlo en `astro.config.mjs`
   (`site: 'https://tudominio.com'`) para que canonical, sitemap y RSS usen la URL
   real. Recompilar y volver a subir.
5. **HTTPS:** activar el certificado SSL gratis de cPanel (*SSL/TLS Status* →
   *Run AutoSSL*). El `.htaccess` ya fuerza `https://`.

Alternativa: subir por **FTP/SFTP** (FileZilla) el contenido de `dist/` a
`public_html/`. Más lento pero no hace falta comprimir.

### El panel de redacción (`/admin/`) en cPanel

Decap CMS necesita un servicio de autenticación que cPanel no trae. Opciones:

- **Editar en local** (lo más simple para empezar): `npm run cms` + `npm run dev`,
  cargar las notas en `http://localhost:4321/admin/` sin login, `git push`,
  recompilar y subir. Sirve mientras escriban una o dos personas.
- **CMS en el sitio:** cambiar el backend de `public/admin/config.yml` a `github`
  y crear una *OAuth App* + un pequeño proxy de autenticación (hay servicios
  gratuitos que lo hostean). Documentar aparte cuando haga falta.
- **Netlify solo para el CMS:** ver más abajo.

> Nota: el workflow de autoactualización (`.github/workflows/actualizar.yml`) hace
> commit en GitHub, pero **no** dispara un deploy en cPanel. Para que los bloques
> de video/agenda se refresquen en el sitio hay que recompilar y volver a subir
> (o automatizar la subida por FTP desde el propio workflow).

## Alternativa: publicar en Netlify (deploy automático + CMS sin configurar)

1. Conectar el repo de GitHub en Netlify (toma el `netlify.toml`: build
   `npm run build`, salida `dist/`). Cada push redespliega solo.
2. En Netlify: **Identity → Enable**, y **Identity → Services → Git Gateway → Enable**.
3. En **Identity → Registration** poner "Invite only" e invitar a las dos personas
   que escriben.
4. Entran a `/admin/`, aceptan la invitación y ya pueden publicar. Cada nota
   guardada es un commit y dispara un nuevo deploy.
5. Apuntar el dominio propio desde el panel de Netlify.

### Antes de publicar de verdad

En `src/consts.ts` poner `prototipo: false`. Eso saca la cinta "PROTOTIPO" y las
notas al pie de contenido de demostración. Después reemplazar las notas de
ejemplo de `src/content/articulos/` por contenido real.

---

## Para la redacción

Ver **[GUIA-REDACCION.md](GUIA-REDACCION.md)**: cómo cargar una nota desde el
panel, paso a paso, sin tecnicismos.
