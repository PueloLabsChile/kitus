import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITIO } from "../consts.ts";

export async function GET(context) {
  const articulos = (await getCollection("articulos", ({ data }) => !data.borrador)).sort(
    (a, b) => b.data.fecha.getTime() - a.data.fecha.getTime(),
  );

  return rss({
    title: SITIO.nombre,
    description: SITIO.descripcion,
    site: context.site,
    items: articulos.map((a) => ({
      title: a.data.titulo,
      description: a.data.bajada,
      pubDate: a.data.fecha,
      link: `/articulo/${a.id}/`,
      categories: [a.data.seccion, ...a.data.etiquetas],
    })),
    customData: `<language>es-ar</language>`,
  });
}
