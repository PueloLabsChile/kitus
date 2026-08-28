export const SITIO = {
  nombre: "Kitus",
  lema: "Ideas de cambio",
  descripcion:
    "Kitus es un medio digital que reúne y difunde ideas de cambio sobre las problemáticas sociales surgidas de las contradicciones de los actuales modelos económicos, políticos, sociales y culturales.",
  descripcionCorta:
    "Medio digital de ideas de cambio. Damos visibilidad a los sectores minorizados por los grandes medios de comunicación.",
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
      "Poder, Estados y disputa institucional: cómo se gobierna y quién decide, dentro y fuera de la región.",
  },
  internacional: {
    nombre: "Internacional",
    descripcion:
      "Geopolítica, conflictos y alineamientos. El tablero mundial mirado desde el Sur global.",
  },
  economia: {
    nombre: "Economía",
    descripcion:
      "Comercio, deuda, recursos y trabajo: la economía política del sistema mundial y sus efectos concretos.",
  },
  derechos: {
    nombre: "Derechos",
    descripcion:
      "Derechos humanos, territorios y ambiente. Los movimientos que empujan el cambio.",
  },
  opinion: {
    nombre: "Opinión",
    descripcion:
      "Análisis y columnas de Kitus y su red de colaboradores y colaboradoras.",
  },
  cultura: {
    nombre: "Cultura",
    descripcion:
      "Ideas, relatos y producción cultural que disputan el sentido común.",
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
