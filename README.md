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
├── components/               Masthead, Nav, Pie, TarjetaArticulo, Boletin, FranjaMultimedia
├── layouts/                  Base.astro (envoltura común)
├── pages/
│   ├── index.astro           Portada (se arma sola con las notas)
│   ├── [seccion].astro       /politica, /economia, ... (una por sección)
│   ├── articulo/[slug].astro  Página de nota
│   ├── quienes-somos.astro
│   ├── multimedia.astro
│   └── rss.xml.js            Feed RSS
└── styles/global.css         Toda la hoja de estilo

public/
├── admin/                    Decap CMS (index.html + config.yml)
├── uploads/                  Imágenes subidas desde el panel
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
- La franja **Multimedia** trae los últimos videos del canal de YouTube en cada
  build (si el feed no responde, muestra tarjetas que enlazan al canal).

---

## Publicar en Netlify (recomendado por el CMS)

1. Subir el repo a GitHub y conectar el sitio en Netlify (toma el `netlify.toml`:
   build `npm run build`, salida `dist/`).
2. En Netlify: **Identity → Enable**, y **Identity → Services → Git Gateway → Enable**.
3. En **Identity → Registration** poner "Invite only" e invitar a las dos personas
   que escriben.
4. Entran a `https://kitus.org/admin/`, aceptan la invitación y ya pueden publicar.
   Cada nota guardada es un commit y dispara un nuevo deploy automático.
5. Conectar el dominio propio desde el panel de Netlify.

> Alternativa sin Netlify: cambiar el backend de `public/admin/config.yml` a
> `github` (requiere crear una OAuth App) y hostear en Cloudflare Pages o GitHub
> Pages. El sitio en sí es estático y corre en cualquier lado.

### Antes de publicar de verdad

En `src/consts.ts` poner `prototipo: false`. Eso saca la cinta "PROTOTIPO" y las
notas al pie de contenido de demostración. Después reemplazar las notas de
ejemplo de `src/content/articulos/` por contenido real.

---

## Para la redacción

Ver **[GUIA-REDACCION.md](GUIA-REDACCION.md)**: cómo cargar una nota desde el
panel, paso a paso, sin tecnicismos.
