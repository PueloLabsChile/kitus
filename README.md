# Kitus — prototipo web

Periódico político digital. Medio de "ideas de cambio" que da visibilidad a los
sectores minorizados por los grandes medios. Este repositorio es el **prototipo
navegable** hecho el 26/08/2026.

- Canal de YouTube de referencia: <https://www.youtube.com/@kitusonline6343>
- Identidad tomada del canal: "K" roja dentro de un círculo + "ITUS" en negro,
  lema *ideas de cambio*, paleta rojo / tinta / papel, tipografía serif editorial.

---

## Qué es esto

Un sitio **estático puro**: solo HTML y CSS, sin framework, sin `node_modules`,
sin paso de compilación. Se abre con doble clic o se sube tal cual a cualquier
hosting. Elegido así a propósito: "funciona solo", es gratis de alojar y no se
rompe con el tiempo.

```
kitus/
├── index.html              Portada
├── politica.html           Sección (+ internacional, economia, derechos, opinion, cultura)
├── multimedia.html         Hub de videos del canal
├── quienes-somos.html      Institucional + equipo + contacto
├── articulo/
│   ├── reforma-laboral.html Nota de ejemplo (plantilla completa)
│   ├── deuda-fmi.html
│   └── agua-litio.html
├── css/kitus.css           Toda la hoja de estilo
├── js/kitus.js             Año dinámico, nav activa, alta al boletín (demo)
├── assets/logo-kitus.svg   Logo reconstruido en vector
├── branding/               Logo y banner originales bajados de YouTube
├── _gen-secciones.sh       Regenera las páginas de sección desde una plantilla
└── GUIA-REDACCION.md       Cómo cargar una nota (para las dos personas que escriben)
```

> Todas las páginas llevan una cinta "PROTOTIPO · contenido de demostración".
> Los textos de las notas son de muestra, escritos para ver el diseño con
> contenido realista. Hay que reemplazarlos antes de cualquier publicación.

---

## Verlo en local

Cualquiera de estas opciones:

- **Doble clic** en `index.html` (funciona, aunque el menú "sección activa" y el
  alta al boletín se ven mejor con un servidor).
- **Con un servidor** (recomendado), desde la carpeta del proyecto:

  ```bash
  # con Python
  python -m http.server 8787
  # luego abrir http://127.0.0.1:8787
  ```

---

## Publicarlo (gratis)

El sitio es 100% estático, así que sirve cualquiera de estos:

| Opción | Cómo | Costo |
|---|---|---|
| **Netlify Drop** | Arrastrar la carpeta `kitus/` a <https://app.netlify.com/drop> | Gratis |
| **GitHub Pages** | Subir el repo, activar Pages sobre la rama `main` (carpeta raíz) | Gratis |
| **Cloudflare Pages** | Conectar el repo, sin comando de build, directorio de salida `/` | Gratis |

Después se conecta el dominio propio (`kitus.org` / `.com` / `.ar`) desde el
panel del hosting elegido.

---

## Fase 2 — cuando haya que cargar notas seguido

El prototipo está pensado para migrar sin rehacer el diseño. Plan sugerido:

1. **Liberar espacio en disco** (hoy `C:` está al 100%; hace falta ~1 GB para las
   herramientas).
2. Pasar el mismo HTML/CSS a **Astro** (contenido en Markdown, genera el sitio
   estático). El diseño actual se reutiliza casi sin cambios.
3. Sumar **Decap CMS** (`/admin`): las dos personas que escriben editan las notas
   desde un panel web, sin tocar código; cada cambio queda versionado en Git.
4. Automatizar el **boletín** (Buttondown o Listmonk) y el **RSS**.

Mientras tanto, para cargar notas en el prototipo: ver `GUIA-REDACCION.md`.
