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

    // Origen de la nota: "propia" (redacción / canal) o "sindicada" (republicada
    // de un medio aliado bajo licencia Creative Commons, la genera actualizar.mjs).
    origen: z.enum(["propia", "sindicada"]).default("propia"),
    // Solo para sindicadas: firma real, medio de origen, enlace al original y licencia.
    firma: z.string().optional(),
    fuente: z.string().optional(),
    fuenteUrl: z.string().optional(),
    original: z.string().optional(),
    licencia: z.string().optional(),
    licenciaUrl: z.string().optional(),

    // Solo sección "musica": formato (va en la volanta) y enlaces para escuchar.
    formato: z.string().optional(),
    escuchar: z.array(z.string()).default([]),
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
