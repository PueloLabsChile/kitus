#!/usr/bin/env node
/**
 * Actualiza el contenido automático de Kitus:
 *   - src/data/videos.json     : últimos videos del canal de YouTube
 *   - src/data/titulares.json  : agregado internacional (bloque "Hoy" y página /hoy/)
 *   - public/uploads/yt-*.jpg  : miniaturas de los videos nuevos
 *
 * Sin dependencias. Sin API keys. Node 20+. Pensado para correr en GitHub Actions.
 * Si una fuente falla, conserva los datos anteriores (no rompe el build).
 *
 * Uso:  node scripts/actualizar.mjs
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36";

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
/** Quita HTML, normaliza espacios y recorta en límite de palabra. */
function resumir(html, limite = 240) {
  // 1) desenvolver CDATA y entidades  2) quitar etiquetas reales  3) decodificar lo que quede
  let s = decodeEntities(String(html || ""));
  s = decodeEntities(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .replace(/\s*\[\s*…?\s*\]\s*$/, "")
    .replace(/(Leer más|Seguir leyendo|Continue reading|Read more|The post .*? appeared first on .*)$/i, "")
    .trim();
  if (s.length <= limite) return s;
  const corte = s.slice(0, limite);
  const ultimoEspacio = corte.lastIndexOf(" ");
  return (ultimoEspacio > 60 ? corte.slice(0, ultimoEspacio) : corte).replace(/[,;:.\s]+$/, "") + "…";
}
function normalizarTitulo(t) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
  // títulos ya curados a mano: se respetan; los videos nuevos usan el título limpio de YouTube
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
        encontrados.push({ id, titulo: tituloPrevio.get(id) || limpiarTitulo(titulo) });
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
      continue; // ya existe
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

/* -------------------------------------------------------------- titulares */
function parsearFeed(xml, fuente) {
  const items = [];
  const bloques = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/g) || [];
  for (const b of bloques.slice(0, 8)) {
    const titulo = decodeEntities((b.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
    let link =
      (b.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) || [])[1] ||
      (b.match(/<link\b[^>]*href=["']([^"']+)["']/i) || [])[1] ||
      decodeEntities((b.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || "");
    const fechaTxt =
      (b.match(/<(pubDate|published|updated|dc:date)\b[^>]*>([\s\S]*?)<\/\1>/i) || [])[2] || "";
    const fecha = fechaTxt && !Number.isNaN(+new Date(fechaTxt)) ? new Date(fechaTxt).toISOString() : null;
    const crudo =
      (b.match(/<description\b[^>]*>([\s\S]*?)<\/description>/i) || [])[1] ||
      (b.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i) || [])[1] ||
      (b.match(/<content:encoded\b[^>]*>([\s\S]*?)<\/content:encoded>/i) || [])[1] ||
      (b.match(/<content\b[^>]*>([\s\S]*?)<\/content>/i) || [])[1] ||
      "";
    if (!titulo || !link) continue;
    let resumen = resumir(crudo);
    // algunos feeds arrancan el resumen repitiendo el titular: lo sacamos
    if (resumen.toLowerCase().startsWith(titulo.toLowerCase().slice(0, 60))) {
      resumen = resumen.slice(titulo.length).replace(/^[\s.–—-]+/, "");
    }
    items.push({
      titulo,
      resumen,
      url: link.trim(),
      medio: fuente.medio,
      pais: fuente.pais || "",
      idioma: fuente.idioma || "es",
      fecha,
    });
  }
  return items;
}

async function traerTitulares(fuentes, maxItems, previos) {
  const todo = [];
  let ok = 0;
  for (const f of fuentes) {
    try {
      const xml = await bajar(f.url, { timeout: 15000 });
      const items = parsearFeed(xml, f);
      log(`${f.medio}: ${items.length} titulares`);
      if (items.length) ok++;
      todo.push(...items);
    } catch (e) {
      log(`${f.medio}: falló (${e.message})`);
    }
  }
  if (ok === 0) {
    log("ningún feed respondió — se conservan los titulares actuales");
    return previos;
  }

  // dedup por URL y por título normalizado
  const porUrl = new Set();
  const porTitulo = new Set();
  const unicos = [];
  for (const it of todo) {
    const t = normalizarTitulo(it.titulo);
    if (porUrl.has(it.url) || porTitulo.has(t)) continue;
    porUrl.add(it.url);
    porTitulo.add(t);
    unicos.push(it);
  }

  unicos.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));

  // primera vuelta: un titular por medio (para que ninguno acapare el arranque)
  const usados = new Set();
  const orden = [];
  const vistoMedio = new Set();
  for (const it of unicos) {
    if (!vistoMedio.has(it.medio)) {
      vistoMedio.add(it.medio);
      usados.add(it);
      orden.push(it);
    }
  }
  for (const it of unicos) if (!usados.has(it)) orden.push(it);

  return orden.slice(0, maxItems);
}

/* --------------------------------------------------------------------- run */
const cfg = await leerJSON("scripts/fuentes.json", null);
if (!cfg) {
  console.error("Falta scripts/fuentes.json");
  process.exit(1);
}

const videosPrevios = await leerJSON("src/data/videos.json", []);
const titularesPrevios = await leerJSON("src/data/titulares.json", []);

const videos = await traerVideos(cfg.canalYoutube, videosPrevios);
await bajarMiniaturas(videos);
await guardarJSON("src/data/videos.json", videos);

const titulares = await traerTitulares(
  cfg.internacional || [],
  cfg.maxTitulares ?? 60,
  titularesPrevios,
);
await guardarJSON("src/data/titulares.json", titulares);
log(`titulares: ${titulares.length} guardados`);

log("listo.");
