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
      "Poder, Congreso, gobierno y territorio. La política argentina contada sin agenda ajena.",
  },
  internacional: {
    nombre: "Internacional",
    descripcion:
      "América Latina y el mundo desde una mirada del sur, atenta a los que quedan fuera del relato.",
  },
  economia: {
    nombre: "Economía",
    descripcion:
      "Números que se sienten en el bolsillo: precios, deuda, salarios y quién gana con cada medida.",
  },
  derechos: {
    nombre: "Derechos",
    descripcion:
      "Derechos humanos, ambiente, género y salud. Los temas que inciden en el entorno social de cada comunidad.",
  },
  opinion: {
    nombre: "Opinión",
    descripcion:
      "Columnas y editoriales de Kitus y su red de colaboradores y colaboradoras.",
  },
  cultura: {
    nombre: "Cultura",
    descripcion:
      "Arte, ideas y producción audiovisual que dan visibilidad a lo que los grandes medios no muestran.",
  },
} as const;

export type SeccionSlug = keyof typeof SECCIONES;
export const SECCION_SLUGS = Object.keys(SECCIONES) as SeccionSlug[];

export function nombreSeccion(slug: string): string {
  return (SECCIONES as Record<string, { nombre: string }>)[slug]?.nombre ?? slug;
}
