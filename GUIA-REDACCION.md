# Cómo cargar una nota en Kitus

Guía para las dos personas que escriben. Ahora las notas se cargan desde un
**panel web**; no hace falta tocar código ni archivos.

---

## Entrar al panel

1. Ir a **`https://kitus.org/admin/`** (mientras no esté el dominio:
   `https://<nombre-del-sitio>.netlify.app/admin/`).
2. Iniciar sesión con el correo con el que te invitaron.

> Para probar en la computadora de desarrollo: abrir dos terminales, en una
> `npm run cms` y en otra `npm run dev`, y entrar a
> `http://localhost:4321/admin/` (no pide contraseña).

---

## Crear una nota

1. En el panel, **Notas → New Nota**.
2. Completar los campos:

| Campo | Qué poner |
|---|---|
| **Titular** | El título de la nota. |
| **Bajada** | Una o dos oraciones que resumen y enganchan. |
| **Sección** | Política, Internacional, Economía, Derechos, Opinión o Cultura. |
| **Autor/a** | Elegir de la lista. Si falta alguien, se crea en "Autores/as". |
| **Fecha** | Día de publicación. |
| **Etiquetas** | Palabras clave. La **primera** aparece en la volanta (arriba del título). |
| **Foto de apertura** | Subir una imagen (hasta 3 MB). Es opcional: sin foto se muestra un recuadro gris. |
| **Epígrafe y crédito** | Texto al pie de la foto (qué se ve y quién la tomó). |
| **Nota de tapa** | Activar solo si querés que sea la nota grande de la portada. Una sola a la vez. |
| **Es columna de opinión** | Activar para columnas y editoriales (van a la sección Opinión y a la columna lateral de la portada). |
| **Borrador** | Activar mientras la estás escribiendo: no se publica. |
| **Texto de la nota** | El cuerpo. Ver abajo. |

3. **Guardar**. Queda como borrador de trabajo.
4. Cuando esté lista: mover a **"Ready"** y después **"Publish"**.
   A los pocos minutos aparece en el sitio (portada, sección y RSS se actualizan solos).

---

## Escribir el texto

El editor tiene barra de formato (negrita, cursiva, enlaces, listas). Además:

- **Subtítulos**: usá el estilo "Heading 2" para los intertítulos.
- **Cita destacada**: el estilo "Quote" para frases que van resaltadas con la
  línea roja al costado.
- **Enlaces**: seleccionar el texto y pegar la dirección.
- La primera letra de la nota se muestra grande y en rojo automáticamente.

---

## Editar o despublicar

- **Corregir**: abrir la nota en el panel, cambiar y volver a publicar.
- **Bajar una nota**: activar **Borrador** y publicar; deja de aparecer.

---

## Checklist antes de publicar

- [ ] Titular y bajada sin errores
- [ ] Sección y autor/a correctos
- [ ] Etiquetas cargadas (la primera es la volanta)
- [ ] Foto con epígrafe y crédito, si hay
- [ ] Enlaces que abren bien
- [ ] "Borrador" desactivado
