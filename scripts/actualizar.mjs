#!/usr/bin/env node
/**
 * Actualiza el contenido automático de Kitus:
 *   - src/data/videos.json   : últimos videos del canal de YouTube
 *   - src/data/agenda.json    : titulares de medios afines (feeds RSS de scripts/fuentes.json)
 *   - public/uploads/yt-*.jpg : miniaturas de los videos nuevos
 *
 * Sin dependencias. Node 20+. Pensado para correr en GitHub Actions cada X horas.
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

/* ------------------------------------------------------------------ agenda */
function parsearFeed(xml, medio) {
  const items = [];
  const bloques = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/g) || [];
  for (const b of bloques.slice(0, 6)) {
    const titulo = decodeEntities((b.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
    let link =
      (b.match(/<link\b[^>]*href=["']([^"']+)["']/i) || [])[1] ||
      decodeEntities((b.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || "");
    const fechaTxt =
      (b.match(/<(pubDate|published|updated)\b[^>]*>([\s\S]*?)<\/\1>/i) || [])[2] || "";
    const fecha = fechaTxt ? new Date(fechaTxt).toISOString() : null;
    if (titulo && link) items.push({ titulo, url: link.trim(), medio, fecha });
  }
  return items;
}

async function traerAgenda(fuentes, maxItems, previos) {
  const todo = [];
  for (const f of fuentes) {
    try {
      const xml = await bajar(f.url, { timeout: 15000 });
      const items = parsearFeed(xml, f.medio);
      log(`${f.medio}: ${items.length} titulares`);
      todo.push(...items);
    } catch (e) {
      log(`${f.medio}: falló (${e.message})`);
    }
  }
  if (!todo.length) {
    log("ningún feed respondió — se conserva la agenda actual");
    return previos;
  }
  todo.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
  // uno por medio primero, después completar
  const porMedio = new Map();
  const orden = [];
  for (const it of todo) {
    if (!porMedio.has(it.medio)) {
      porMedio.set(it.medio, true);
      orden.push(it);
    }
  }
  for (const it of todo) if (!orden.includes(it)) orden.push(it);
  return orden.slice(0, maxItems);
}

/* --------------------------------------------------------------------- run */
const cfg = await leerJSON("scripts/fuentes.json", null);
if (!cfg) {
  console.error("Falta scripts/fuentes.json");
  process.exit(1);
}

const videosPrevios = await leerJSON("src/data/videos.json", []);
const agendaPrevia = await leerJSON("src/data/agenda.json", []);

const videos = await traerVideos(cfg.canalYoutube, videosPrevios);
await bajarMiniaturas(videos);
await guardarJSON("src/data/videos.json", videos);

const agenda = await traerAgenda(cfg.agenda || [], cfg.maxAgenda ?? 12, agendaPrevia);
await guardarJSON("src/data/agenda.json", agenda);

log("listo.");
