# Publicar una nota en Kitus

## Acceso

1. Ir a `https://<sitio>.netlify.app/admin/`.
2. Ingresar con la invitacion enviada por Jefatura.
3. Abrir **Notas** y elegir **New Nota**.

En local: ejecutar `npm run cms` y `npm run dev`; abrir `http://localhost:4321/admin/`.

## Antes de publicar

- Titular, bajada, seccion y autor/a.
- Foto de apertura obligatoria.
- Epigrafe y credito obligatorios.
- Fuentes y enlaces revisados.
- Imagen relacionada con la nota y con derecho de uso.
- Marcar **Borrador** mientras se escribe.

## Flujo editorial

- **Corresponsal:** crea, guarda y envia a revision.
- **Jefatura:** revisa, publica o devuelve correcciones.
- Tras publicar, el CMS muestra el enlace de la nota. El deploy de Netlify actualiza portada, seccion y RSS.

Nunca se publica una nota sin autoria, fuentes, imagen y credito.
