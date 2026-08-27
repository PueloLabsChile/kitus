import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";
import { SECCION_SLUGS } from "./consts";

const articulos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articulos" }),
  schema: z.object({
    titulo: z.string(),
    bajada: z.string(),
    seccion: z.enum(SECCION_SLUGS as [string, ...string[]]),
    autor: reference("autores"),
    fecha: z.coerce.date(),
    etiquetas: z.array(z.string()).default([]),
    // Ruta pública de la imagen, p. ej. "/uploads/foto.jpg" (subida desde el panel).
    portada: z.string().optional(),
    creditoPortada: z.string().optional(),
    // Nota de tapa: aparece grande en la portada.
    destacada: z.boolean().default(false),
    // Es columna de opinión (va en la columna lateral de la portada).
    opinion: z.boolean().default(false),
    // Borrador: no se publica.
    borrador: z.boolean().default(false),
  }),
});

const autores = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/autores" }),
  schema: z.object({
    nombre: z.string(),
    iniciales: z.string().max(3),
    rol: z.string().default("Redacción"),
    bio: z.string(),
  }),
});

export const collections = { articulos, autores };
