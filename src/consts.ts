export const SITIO = {
  nombre: "Kitus",
  lema: "Ideas de cambio",
  descripcion:
    "Kitus es un medio digital de periodismo político y análisis internacional. Cubre economía, poder institucional, derechos y cultura con contexto, datos y fuentes verificables.",
  descripcionCorta:
    "Medio digital de periodismo político y análisis internacional. Contexto y fuentes, sin muro de pago.",
  youtube: "https://www.youtube.com/@kitusonline6343",
  correoRedaccion: "redaccion@kitus.example",
  correoColabora: "colabora@kitus.example",
  // Poner en false cuando el sitio se publique de verdad.
  prototipo: true,
} as const;

/** Secciones del periódico: slug -> etiqueta y descripción. */
export const SECCIONES = {
  politica: {
    nombre: "Política",
    descripcion:
      "Poder, instituciones y decisiones públicas: quién gobierna, cómo y con qué controles, dentro y fuera de la región.",
  },
  internacional: {
    nombre: "Internacional",
    descripcion:
      "Geopolítica, conflictos y alineamientos, con foco en América Latina y su lugar en el mundo.",
  },
  economia: {
    nombre: "Economía",
    descripcion:
      "Comercio, deuda, recursos naturales y trabajo: cómo funcionan y a quién afectan.",
  },
  derechos: {
    nombre: "Derechos",
    descripcion:
      "Derechos humanos y de la niñez, debido proceso y garantías, territorios y ambiente. Casos concretos, con expediente y fuentes.",
  },
  opinion: {
    nombre: "Opinión",
    descripcion:
      "Análisis y columnas firmadas de Kitus y sus colaboradores.",
  },
  cultura: {
    nombre: "Cultura",
    descripcion:
      "Ideas, relatos y producción cultural, y los debates que abren.",
  },
  musica: {
    nombre: "Música",
    descripcion:
      "Historia de la música para conocerla mejor: corrientes, discos y canciones explicados y con qué escuchar cada uno.",
  },
} as const;

/** Formatos de la sección Música (aparecen en la volanta). */
export const FORMATOS_MUSICA = [
  "Un disco",
  "Una canción",
  "Una corriente",
  "Un artista",
  "Un instrumento",
  "Una época",
] as const;

export type SeccionSlug = keyof typeof SECCIONES;
export const SECCION_SLUGS = Object.keys(SECCIONES) as SeccionSlug[];

export function nombreSeccion(slug: string): string {
  return (SECCIONES as Record<string, { nombre: string }>)[slug]?.nombre ?? slug;
}

/** Minutos de lectura estimados a partir del texto de la nota (~200 palabras/min). */
export function minutosLectura(texto: string | undefined): number {
  const palabras = (texto ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}
