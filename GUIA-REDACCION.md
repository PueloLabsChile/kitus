# Cómo cargar una nota en Kitus (prototipo)

Guía para las dos personas que escriben. Mientras el sitio sea el prototipo
estático, una nota nueva es **copiar un archivo y cambiarle el texto**. No hace
falta saber programar.

---

## 1. Copiar la plantilla

En la carpeta `articulo/` ya hay una nota modelo: **`reforma-laboral.html`**.

1. Copiá ese archivo en la misma carpeta `articulo/`.
2. Renombralo con un nombre corto, en minúsculas, sin espacios ni acentos, con
   guiones. Ese nombre es la dirección de la nota.
   - Ejemplo: `paro-docente-septiembre.html` →
     `https://kitus.org/articulo/paro-docente-septiembre.html`

## 2. Cambiar los datos de arriba (en `<head>`)

Abrí el archivo con un editor de texto (Bloc de notas, VS Code, lo que uses) y
reemplazá solo el texto, no las etiquetas:

```html
<title>ACÁ EL TITULAR — Kitus</title>
<meta name="description" content="ACÁ UN RESUMEN DE UNA O DOS ORACIONES.">
```

## 3. Cambiar el cuerpo de la nota

Buscá estos bloques y reemplazá el contenido:

| Qué | Se ve así en el archivo |
|---|---|
| Volanta (tema) | `<p class="kicker">Política · Trabajo</p>` |
| Titular | `<h1>...</h1>` |
| Bajada | `<p class="dek">...</p>` |
| Firma y fecha | dentro de `<div class="articulo__meta">` |
| Texto | los `<p>...</p>` dentro de `<div class="cuerpo">` |
| Subtítulos | `<h2>...</h2>` |
| Cita destacada | `<blockquote>...</blockquote>` |
| Etiquetas | los `<a href="#">...</a>` dentro de `<div class="etiquetas">` |
| Bio de autor/a | dentro de `<div class="autor-bio">` (iniciales + nombre + bio) |

Reglas simples:

- Cada párrafo va entre `<p>` y `</p>`.
- Un subtítulo intermedio va entre `<h2>` y `</h2>`.
- Para un enlace: `<a href="https://...">texto del enlace</a>`.
- No borres las comillas ni los `<` `>`. Si algo se rompe, volvé a copiar la
  plantilla y empezá de nuevo.

## 4. La foto de apertura

En el prototipo hay un recuadro gris que dice "IMAGEN · KITUS". Cuando haya foto
real, se reemplaza este bloque:

```html
<div class="ph"></div>
```

por:

```html
<img src="../assets/nombre-de-la-foto.jpg" alt="Descripción de la foto">
```

y se copia la imagen dentro de la carpeta `assets/`.

## 5. Poner la nota en la portada y en su sección

La portada (`index.html`) y las páginas de sección **no se actualizan solas** en
el prototipo. Para que la nota aparezca:

1. Abrí `index.html`.
2. Copiá uno de los bloques `<article class="tarjeta"> ... </article>`.
3. Cambiale la volanta, el titular, la bajada, la firma y el enlace:
   `<a href="articulo/tu-nota.html">`.
4. Hacé lo mismo en la página de la sección que corresponda
   (`politica.html`, `economia.html`, etc.).

> En la Fase 2 (Astro + CMS) este paso 5 desaparece: la portada y las secciones
> se arman solas a partir de las notas.

## 6. Publicar

- Si el sitio está en **Netlify Drop**: volver a arrastrar la carpeta `kitus/`.
- Si está en **GitHub Pages / Cloudflare**: subir los cambios al repositorio
  (`git add`, `git commit`, `git push`) y en un minuto queda online.

---

## Checklist antes de publicar

- [ ] Titular y bajada sin errores
- [ ] Firma y fecha correctas
- [ ] Enlaces que abren bien
- [ ] La nota se ve en la portada y en su sección
- [ ] Si es contenido real: sacar el texto de demostración y, si se puede, la
      cinta "PROTOTIPO" (está en cada archivo como
      `<div class="cinta-proto">...</div>`)
