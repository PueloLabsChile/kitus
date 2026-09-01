#!/usr/bin/env node
/**
 * Actualiza el contenido automático de Kitus:
 *   - src/data/videos.json            : últimos videos del canal de YouTube
 *   - src/content/articulos/sind__*.md : notas republicadas de medios con licencia
 *                                        Creative Commons (ver scripts/fuentes.json)
 *   - public/uploads/yt-*.jpg          : miniaturas de los videos nuevos
 *
 * Sin dependencias. Sin API keys. Node 20+. Pensado para GitHub Actions.
 * Si una fuente falla, no rompe nada: sigue con las demás.
 *
 * Uso:  node scripts/actualizar.mjs
 */
import { readFile, writeFile, mkdir, access, readdir, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36";
const PREFIJO = "sind__"; // marca los .md generados automáticamente

// Discurso que el medio decidió no cubrir: se excluye del agregado y de la franja de videos.
// (No filtra la mención factual de un delito —p. ej. "feminicidio" como cargo penal— en una nota
//  que no es sobre feminismo; para eso ampliar la lista.)
const RE_EXCLUIR =
  /feminis|patriarcad|sororidad|abort(o|os|ar|ista)|violencia de género|violencia machista|brecha de género|paridad de género|feminismos? campesin|movimiento de mujeres/i;

const log = (...a) => console.log("[actualizar]", ...a);

async function leerJSON(rel, porDefecto) {
  try {
    return JSON.parse(await readFile(join(RAIZ, rel), "utf8"));
  } catch {
    return porDefecto;
  }
}
async function guardarJSON(rel, data) {
  await writeFile(join(RAIZ, rel), JSON.stringify(data, null, 2) + "\n", "utf8");
}
async function bajar(url, opts = {}) {
  const r = await fetch(url, {
    headers: { "user-agent": UA, "accept-language": "es-ES,es;q=0.9", ...(opts.headers || {}) },
    signal: AbortSignal.timeout(opts.timeout ?? 20000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${url}`);
  return r.text();
}
function decodeEntities(s = "") {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .trim();
}
function limpiarTitulo(t) {
  t = decodeEntities(t)
    .replace(/\s*\((?:english[^)]*|castellano|subtitulad[ao][^)]*)\)\s*/gi, "")
    .replace(/ENTREVISTA\s*\/\s*INTERVIEW\s*/i, "Entrevista a ")
    .replace(/\bENTREVISTA\b/i, "Entrevista")
    .trim();
  if (t === t.toUpperCase() && t.length > 4) t = t.charAt(0) + t.slice(1).toLowerCase();
  return t;
}
function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
function hash(s = "") {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/* ------------------------------------------------------------------ imágenes */
// Saca la URL de la foto principal de un item de feed: primero las etiquetas
// media:*/enclosure (WordPress las trae casi siempre), si no el primer <img>.
function extraerImagen(bloque = "", cuerpoHtml = "") {
  const b = String(bloque);
  const m =
    b.match(/<media:content\b[^>]*\bmedium=["']image["'][^>]*\burl=["']([^"']+)["']/i) ||
    b.match(/<media:content\b[^>]*\burl=["']([^"']+\.(?:jpe?g|png|webp)[^"']*)["']/i) ||
    b.match(/<media:thumbnail\b[^>]*\burl=["']([^"']+)["']/i) ||
    b.match(/<enclosure\b[^>]*\btype=["']image\/[^"']*["'][^>]*\burl=["']([^"']+)["']/i) ||
    b.match(/<enclosure\b[^>]*\burl=["']([^"']+)["'][^>]*\btype=["']image\//i);
  if (m) return decodeEntities(m[1]);
  const m2 = String(cuerpoHtml).match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  return m2 ? decodeEntities(m2[1]) : "";
}
// Descarga la foto a public/uploads/sind-<base>.<ext> y devuelve su ruta pública
// ("/uploads/…"). Si algo falla devuelve "" y la nota queda sin portada.
async function descargarImagen(url, base) {
  if (!url || !/^https?:\/\//i.test(url)) return "";
  const dir = join(RAIZ, "public", "uploads");
  await mkdir(dir, { recursive: true });
  const ext = ((url.split(/[?#]/)[0].match(/\.(jpe?g|png|webp)$/i) || [])[1] || "jpg")
    .toLowerCase()
    .replace("jpeg", "jpg");
  const archivo = `sind-${base}.${ext}`;
  const destino = join(dir, archivo);
  try {
    await access(destino);
    return `/uploads/${archivo}`;
  } catch {}
  try {
    const r = await fetch(url, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) return "";
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 2000) return ""; // pixel de tracking o error disfrazado
    await writeFile(destino, buf);
    log(`  foto: ${archivo} (${Math.round(buf.length / 1024)} kB)`);
    return `/uploads/${archivo}`;
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ videos */
async function traerVideos(cfg, previos) {
  const url = `https://www.youtube.com/@${cfg.handle}/videos`;
  let html;
  try {
    html = await bajar(url);
  } catch (e) {
    log("no se pudo leer el canal:", e.message, "— se conservan los videos actuales");
    return previos;
  }
  const m = html.match(/ytInitialData\s*=\s*(\{.*?\});<\/script>/s);
  if (!m) {
    log("no se encontró ytInitialData — se conservan los videos actuales");
    return previos;
  }
  let data;
  try {
    data = JSON.parse(m[1]);
  } catch {
    log("ytInitialData ilegible — se conservan los videos actuales");
    return previos;
  }
  const tituloPrevio = new Map(previos.map((v) => [v.id, v.titulo]));
  const encontrados = [];
  const visto = new Set();
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    if (o.lockupViewModel) {
      const lm = o.lockupViewModel;
      const id = lm.contentId;
      const titulo = lm?.metadata?.lockupMetadataViewModel?.title?.content;
      if (id && titulo && !visto.has(id)) {
        visto.add(id);
        const display = tituloPrevio.get(id) || limpiarTitulo(titulo);
        if (!RE_EXCLUIR.test(titulo) && !RE_EXCLUIR.test(display)) {
          encontrados.push({ id, titulo: display });
        }
      }
    }
    for (const v of Object.values(o)) walk(v);
  })(data);

  if (!encontrados.length) {
    log("0 videos detectados — se conservan los actuales");
    return previos;
  }
  const lista = encontrados.slice(0, cfg.maxVideos ?? 24);
  const nuevos = lista.filter((v) => !tituloPrevio.has(v.id)).length;
  log(`videos: ${lista.length} en total, ${nuevos} nuevo(s)`);
  return lista;
}

async function bajarMiniaturas(videos) {
  const dir = join(RAIZ, "public", "uploads");
  await mkdir(dir, { recursive: true });
  let nuevas = 0;
  for (const v of videos) {
    const destino = join(dir, `yt-${v.id}.jpg`);
    try {
      await access(destino);
      continue;
    } catch {}
    for (const variante of ["sddefault", "hqdefault"]) {
      try {
        const r = await fetch(`https://i.ytimg.com/vi/${v.id}/${variante}.jpg`, {
          headers: { "user-agent": UA },
          signal: AbortSignal.timeout(20000),
        });
        if (r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          if (buf.length > 2000) {
            await writeFile(destino, buf);
            nuevas++;
            break;
          }
        }
      } catch {}
    }
  }
  if (nuevas) log(`miniaturas nuevas: ${nuevas}`);
}

/* ------------------------------------------------------ HTML -> Markdown */
function htmlAMarkdown(html) {
  let s = decodeEntities(String(html || ""));
  // fuera bloques que no queremos
  s = s
    .replace(/<(script|style|iframe|form|noscript|figure|figcaption)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<img\b[^>]*>/gi, "") // sin imágenes: evita hotlinking y dudas de derechos
    .replace(/<div class="[^"]*sharedaddy[\s\S]*?<\/div>/gi, "");
  // encabezados
  s = s.replace(/<h[1-2]\b[^>]*>([\s\S]*?)<\/h[1-2]>/gi, "\n\n## $1\n\n");
  s = s.replace(/<h[3-6]\b[^>]*>([\s\S]*?)<\/h[3-6]>/gi, "\n\n### $1\n\n");
  // citas
  s = s.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) =>
    "\n\n" + c.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().replace(/^/gm, "> ") + "\n\n",
  );
  // listas
  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => "\n- " + c.replace(/<[^>]+>/g, " ").trim());
  s = s.replace(/<\/(ul|ol)>/gi, "\n\n");
  // énfasis
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  // enlaces (solo si el destino es navegable; si no, dejamos el texto suelto)
  s = s.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, txt) => {
    const t = txt.replace(/<[^>]+>/g, "").trim();
    if (!t) return "";
    return /^(https?:\/\/|mailto:)/i.test(href) ? `[${t}](${href})` : t;
  });
  // párrafos y saltos
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/p>/gi, "\n\n").replace(/<p\b[^>]*>/gi, "");
  // lo que quede de HTML, fuera
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  // limpieza de espacios
  s = s
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  // sacar volantas decorativas al inicio ("### **Por X**", "### **Desde Y**", etc.)
  while (/^#{1,6}\s*\*{0,2}\s*(Por|Desde|Texto|Fotos?|Imagen|Ilustraci|By)\b[^\n]*$/i.test(s)) {
    s = s.slice(s.indexOf("\n") + 1).trimStart();
  }
  return s;
}
function primerParrafo(md, limite = 240) {
  const p = md.split(/\n{2,}/).find((x) => x.trim() && !x.startsWith("#") && !x.startsWith(">")) || "";
  const t = p.replace(/[*_>#\[\]]/g, "").replace(/\]\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  if (t.length <= limite) return t;
  const corte = t.slice(0, limite);
  return corte.slice(0, corte.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}

/* -------------------------------------------------- adivinar la sección */
const CLAVES_SECCION = [
  ["economia", /\beconom|\bdeuda\b|\bfmi\b|inflaci[óo]n|\bcomercio\b|arancel|\blitio\b|petr[óo]le|miner[íi]a|salari|\btrabajador|mercado laboral|banco central/i],
  ["derechos", /derechos humanos|feminis|\bmujer|g[ée]nero|migrant|refugiad|ambient|clim[áa]tic|indí?gen|territorio|campesin|agrot[óo]x|agroecolog|agricultura|extractiv|\blgbt|aborto|\bpres[oa]s? polít/i],
  ["cultura", /\bcine\b|pel[íi]cula|festival de cine|\blibro\b|literat|m[úu]sica|\bartist|documental|\bteatro\b|\bpoeta\b|\bpoes[íi]a\b/i],
  ["politica", /elecci[óo]n|\bgobierno\b|president[ae]|congreso|parlament|golpe de estado|constituci[óo]n|corrupci[óo]n|\bpartido\b/i],
];
function adivinarSeccion(texto) {
  for (const [slug, rx] of CLAVES_SECCION) if (rx.test(texto)) return slug;
  return "internacional";
}

/* -------------------------------------------------- sindicar artículos */
function itemsDeFeed(xml) {
  return (xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/g) || []).map((b) => {
    const g = (re) => (b.match(re) || [])[1] || "";
    const titulo = decodeEntities(g(/<title\b[^>]*>([\s\S]*?)<\/title>/i));
    const link =
      g(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) ||
      g(/<link\b[^>]*href=["']([^"']+)["']/i) ||
      decodeEntities(g(/<link\b[^>]*>([\s\S]*?)<\/link>/i));
    const fechaTxt =
      (b.match(/<(pubDate|published|updated|dc:date)\b[^>]*>([\s\S]*?)<\/\1>/i) || [])[2] || "";
    const autor = decodeEntities(
      g(/<dc:creator\b[^>]*>([\s\S]*?)<\/dc:creator>/i) ||
        g(/<author\b[^>]*>[\s\S]*?<name\b[^>]*>([\s\S]*?)<\/name>[\s\S]*?<\/author>/i) ||
        g(/<author\b[^>]*>([\s\S]*?)<\/author>/i),
    );
    const cuerpoHtml =
      g(/<content:encoded\b[^>]*>([\s\S]*?)<\/content:encoded>/i) ||
      g(/<content\b[^>]*>([\s\S]*?)<\/content>/i) ||
      g(/<description\b[^>]*>([\s\S]*?)<\/description>/i);
    const imagen = extraerImagen(b, cuerpoHtml);
    return { titulo, link: link.trim(), fechaTxt, autor, cuerpoHtml, imagen };
  });
}

// Notas sindicadas viejas que se guardaron sin foto: intenta recuperarla del
// og:image de la nota original. Acotado por corrida para no golpear las fuentes.
async function backfillImagenes(dir, limite = 10) {
  const files = (await readdir(dir)).filter((f) => f.startsWith(PREFIJO));
  let hechos = 0;
  for (const f of files) {
    if (hechos >= limite) break;
    const ruta = join(dir, f);
    let txt;
    try {
      txt = (await readFile(ruta, "utf8")).replace(/\r\n/g, "\n");
    } catch {
      continue;
    }
    const fmEnd = txt.indexOf("\n---\n", 4);
    if (fmEnd === -1 || /^portada:/m.test(txt.slice(0, fmEnd))) continue;
    const orig = (txt.match(/^original:\s*"?([^"\n]+?)"?\s*$/m) || [])[1];
    const medio = (txt.match(/^fuente:\s*"?([^"\n]+?)"?\s*$/m) || [])[1] || "medio aliado";
    if (!orig) continue;
    let html;
    try {
      html = await bajar(orig);
    } catch {
      continue;
    }
    const og = (html.match(
      /<meta[^>]+(?:property|name)=["']og:image(?::url)?["'][^>]+content=["']([^"']+)["']/i,
    ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image(?::url)?["']/i,
      ) ||
      [])[1];
    if (!og) continue;
    const portada = await descargarImagen(og, `${slugify(medio)}-${hash(orig)}`);
    if (!portada) continue;
    const nuevo =
      txt.slice(0, fmEnd) +
      `\nportada: ${JSON.stringify(portada)}` +
      `\ncreditoPortada: ${JSON.stringify("Foto: " + medio)}` +
      txt.slice(fmEnd);
    await writeFile(ruta, nuevo, "utf8");
    hechos++;
  }
  if (hechos) log(`backfill de imágenes: ${hechos} nota(s) recuperaron su foto`);
}

async function sindicar(fuentes, cfg) {
  const dir = join(RAIZ, "src", "content", "articulos");
  await mkdir(dir, { recursive: true });
  const existentes = (await readdir(dir)).filter((f) => f.startsWith(PREFIJO));
  const limiteViejo = Date.now() - (cfg.diasQueSeConservan ?? 45) * 864e5;

  let creados = 0;
  const vigentes = new Set();

  for (const f of fuentes) {
    let xml;
    try {
      xml = await bajar(f.url, { timeout: 20000 });
    } catch (e) {
      log(`${f.medio}: falló (${e.message}) — se conservan sus notas`);
      // marcar sus notas como vigentes para que no se borren
      for (const n of existentes) if (n.startsWith(PREFIJO + slugify(f.medio))) vigentes.add(n);
      continue;
    }
    const items = itemsDeFeed(xml).slice(0, f.maxPorFeed ?? 4);
    let ok = 0;
    for (const it of items) {
      if (!it.titulo || !it.link || !it.cuerpoHtml) continue;
      // saltear posts promocionales / de servicio
      if (/\b(apoya|apoy[áa]|suscr[ií]b|newsletter|bolet[íi]n|campa[ñn]a spotlight|dona\b|donaci[óo]n)\b/i.test(it.titulo)) {
        continue;
      }
      const fecha = new Date(it.fechaTxt);
      if (Number.isNaN(+fecha) || +fecha < limiteViejo) continue;

      const cuerpo = htmlAMarkdown(it.cuerpoHtml);
      if (cuerpo.length < 400) continue; // demasiado corto: probablemente solo un resumen
      // temas que el medio no cubre
      if (RE_EXCLUIR.test(`${it.titulo} ${cuerpo}`)) {
        continue;
      }

      const slugPost = slugify(it.link.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "")) ||
        slugify(it.titulo);
      const nombre = `${PREFIJO}${slugify(f.medio)}__${slugPost}.md`.slice(0, 120);
      vigentes.add(nombre);
      const ruta = join(dir, nombre);

      try {
        await access(ruta);
        ok++;
        continue; // ya existe: no lo pisamos (la redacción puede haberlo tocado)
      } catch {}

      const fechaISO = fecha.toISOString().slice(0, 10);
      const bajada = primerParrafo(cuerpo);
      const seccion = adivinarSeccion(`${it.titulo} ${bajada}`);
      const firma = it.autor && it.autor.length < 80 ? it.autor : f.medio;
      const portada = it.imagen
        ? await descargarImagen(it.imagen, `${slugify(f.medio)}-${hash(it.link)}`)
        : "";
      const fm = [
        "---",
        `titulo: ${JSON.stringify(it.titulo)}`,
        `bajada: ${JSON.stringify(bajada)}`,
        `seccion: ${seccion}`,
        "autor: medios-aliados",
        `fecha: ${fechaISO}`,
        `etiquetas: [${JSON.stringify(f.medio)}]`,
        ...(portada
          ? [
              `portada: ${JSON.stringify(portada)}`,
              `creditoPortada: ${JSON.stringify("Foto: " + f.medio)}`,
            ]
          : []),
        "origen: sindicada",
        `firma: ${JSON.stringify(firma)}`,
        `fuente: ${JSON.stringify(f.medio)}`,
        `fuenteUrl: ${JSON.stringify(f.home || "")}`,
        `original: ${JSON.stringify(it.link)}`,
        `licencia: ${JSON.stringify(f.licencia || "")}`,
        `licenciaUrl: ${JSON.stringify(f.licenciaUrl || "")}`,
        "---",
        "",
      ].join("\n");
      const pie =
        `\n\n---\n\n*Publicado originalmente en [${f.medio}](${it.link}) el ` +
        `${fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}. ` +
        `Reproducido por Kitus bajo licencia [${f.licencia}](${f.licenciaUrl}). ` +
        `El texto no fue modificado.*\n`;
      await writeFile(ruta, fm + cuerpo + pie, "utf8");
      creados++;
      ok++;
    }
    log(`${f.medio}: ${ok} nota(s) vigentes (${items.length} en el feed)`);
  }

  await backfillImagenes(dir);

  // podar: notas sindicadas que ya no están en ningún feed y superan la antigüedad
  let podadas = 0;
  for (const n of existentes) {
    if (vigentes.has(n)) continue;
    const ruta = join(dir, n);
    try {
      const txt = await readFile(ruta, "utf8");
      const m = txt.match(/^fecha:\s*(\d{4}-\d{2}-\d{2})/m);
      const vieja = m ? new Date(m[1]).getTime() < limiteViejo : true;
      if (vieja) {
        // borra también su foto para que public/uploads no crezca sin fin
        const img = (txt.match(/^portada:\s*"?(\/uploads\/[^"\n]+?)"?\s*$/m) || [])[1];
        if (img) await unlink(join(RAIZ, "public", img)).catch(() => {});
        await unlink(ruta);
        podadas++;
      }
    } catch {}
  }
  log(`sindicación: ${creados} nota(s) nueva(s), ${podadas} podada(s)`);
}

/* --------------------------------------------------------------------- run */
const cfg = await leerJSON("scripts/fuentes.json", null);
if (!cfg) {
  console.error("Falta scripts/fuentes.json");
  process.exit(1);
}

const videosPrevios = await leerJSON("src/data/videos.json", []);
const videos = await traerVideos(cfg.canalYoutube, videosPrevios);
await bajarMiniaturas(videos);
await guardarJSON("src/data/videos.json", videos);

await sindicar(cfg.sindicadas || [], cfg);

log("listo.");
