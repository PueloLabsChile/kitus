#!/usr/bin/env bash
# Genera las páginas de sección de Kitus a partir de una plantilla común.
# Uso: bash _gen-secciones.sh   (desde la carpeta del proyecto)
set -euo pipefail
cd "$(dirname "$0")"

HEADER() {
cat <<EOF
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>$1 — Kitus</title>
<meta name="description" content="$2">
<link rel="icon" href="assets/logo-kitus.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/kitus.css">
</head>
<body>
<div class="cinta-proto">Prototipo &middot; <strong>contenido de demostraci&oacute;n</strong> &middot; Kitus a&uacute;n no est&aacute; publicado</div>
<header class="masthead">
  <div class="contenedor">
    <div class="masthead__top">
      <span>Mi&eacute;rcoles 26 de agosto de 2026 &middot; Edici&oacute;n digital</span>
      <span><a href="quienes-somos.html">Qui&eacute;nes somos</a> &middot; <a href="https://www.youtube.com/@kitusonline6343" target="_blank" rel="noopener">YouTube</a></span>
    </div>
    <div class="masthead__marca">
      <a href="index.html" aria-label="Kitus &mdash; portada">
        <svg viewBox="0 0 430 132" role="img" aria-label="Kitus"><g fill="none" fill-rule="evenodd">
          <path d="M64 12c30 0 53 22 53 52 0 27-22 51-53 51-31 0-54-23-54-51 0-31 24-52 54-52Z" stroke="#C1272D" stroke-width="6" stroke-linecap="round" stroke-dasharray="330 8" transform="rotate(-4 64 64)"/>
          <text x="63" y="95" font-family="'Playfair Display', Georgia, serif" font-size="90" font-weight="700" fill="#C1272D" text-anchor="middle">K</text>
          <text x="120" y="94" font-family="'Playfair Display', Georgia, serif" font-size="80" font-weight="700" fill="#161616" letter-spacing="3">ITUS</text>
        </g></svg>
        <p class="masthead__lema">Ideas de cambio</p>
      </a>
    </div>
  </div>
  <nav class="nav" aria-label="Secciones"><div class="nav__inner">
    <a href="index.html">Portada</a>
    <a href="politica.html">Pol&iacute;tica</a>
    <a href="internacional.html">Internacional</a>
    <a href="economia.html">Econom&iacute;a</a>
    <a href="derechos.html">Derechos</a>
    <a href="opinion.html">Opini&oacute;n</a>
    <a href="cultura.html">Cultura</a>
    <a href="multimedia.html">Multimedia</a>
  </div></nav>
</header>
<main class="contenedor">
  <div class="seccion-cabecera">
    <h1>$1</h1>
    <p>$2</p>
  </div>
  <section class="rejilla">
EOF
}

CARD() {
cat <<EOF
    <article class="tarjeta">
      <a href="#"><div class="ph"></div></a>
      <p class="kicker">$1</p>
      <h3><a href="#">$2</a></h3>
      <p class="dek">$3</p>
      <p class="byline">Por <strong>$4</strong></p>
    </article>
EOF
}

FOOTER() {
cat <<'EOF'
  </section>
</main>
<footer class="pie">
  <div class="contenedor">
    <div class="pie__grid">
      <div class="pie__marca">
        <svg viewBox="0 0 430 132" role="img" aria-label="Kitus"><g fill="none" fill-rule="evenodd">
          <path d="M64 12c30 0 53 22 53 52 0 27-22 51-53 51-31 0-54-23-54-51 0-31 24-52 54-52Z" stroke="#C1272D" stroke-width="6" stroke-linecap="round" stroke-dasharray="330 8" transform="rotate(-4 64 64)"/>
          <text x="63" y="95" font-family="'Playfair Display', Georgia, serif" font-size="90" font-weight="700" fill="#C1272D" text-anchor="middle">K</text>
          <text x="120" y="94" font-family="'Playfair Display', Georgia, serif" font-size="80" font-weight="700" fill="#161616" letter-spacing="3">ITUS</text>
        </g></svg>
        <p>Medio digital de ideas de cambio. Damos visibilidad a los sectores minorizados por los grandes medios de comunicaci&oacute;n.</p>
      </div>
      <div><h4>Secciones</h4><ul>
        <li><a href="politica.html">Pol&iacute;tica</a></li>
        <li><a href="internacional.html">Internacional</a></li>
        <li><a href="economia.html">Econom&iacute;a</a></li>
        <li><a href="derechos.html">Derechos</a></li>
        <li><a href="opinion.html">Opini&oacute;n</a></li>
        <li><a href="cultura.html">Cultura</a></li>
      </ul></div>
      <div><h4>El medio</h4><ul>
        <li><a href="quienes-somos.html">Qui&eacute;nes somos</a></li>
        <li><a href="quienes-somos.html#equipo">Equipo</a></li>
        <li><a href="quienes-somos.html#contacto">Contacto</a></li>
        <li><a href="multimedia.html">Multimedia</a></li>
      </ul></div>
      <div><h4>Seguinos</h4><ul>
        <li><a href="https://www.youtube.com/@kitusonline6343" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="#">Instagram</a></li>
        <li><a href="#">Bolet&iacute;n</a></li>
        <li><a href="#">RSS</a></li>
      </ul></div>
    </div>
    <div class="pie__legal">
      <span>&copy; <span data-anio>2026</span> Kitus &middot; Ideas de cambio</span>
      <span>Prototipo &mdash; contenido de demostraci&oacute;n</span>
    </div>
  </div>
</footer>
<script src="js/kitus.js"></script>
</body>
</html>
EOF
}

gen() {
  local file="$1" titulo="$2" bajada="$3"
  { HEADER "$titulo" "$bajada"; shift 3; echo "$@"; FOOTER; } > "$file"
  echo "  generado: $file"
}

gen politica.html "Política" "Poder, Congreso, gobierno y territorio. La política argentina contada sin agenda ajena." "$(
  CARD "Política · Trabajo" "La reforma laboral llega al Congreso sin acuerdo sindical" "El oficialismo busca aprobar el capítulo de modernización antes del receso." "Marina Kordon"
  CARD "Política" "El Presupuesto 2027 entra en zona de negociación con las provincias" "Gobernadores reclaman obras y fondos a cambio de acompañar el número." "Marina Kordon"
  CARD "Política" "Mapa de alianzas: cómo queda el tablero legislativo tras el verano" "Quién tiene los votos para cada tema sensible del segundo semestre." "Diego Salazar"
  CARD "Política" "Boleta única: qué cambia en la próxima elección" "Guía práctica de la nueva forma de votar y sus efectos." "Diego Salazar"
  CARD "Política" "Provincias: el reclamo por la coparticipación vuelve a la Corte" "Tres distritos avanzan con demandas por fondos retenidos." "Marina Kordon"
  CARD "Política" "Seguridad: el debate por las policías locales, sin datos públicos" "Faltan estadísticas comparables para evaluar los planes." "Diego Salazar"
)"

gen internacional.html "Internacional" "América Latina y el mundo desde una mirada del sur, atenta a los que quedan fuera del relato." "$(
  CARD "Internacional" "Elecciones en la región: el mapa que deja el nuevo ciclo político" "Tres claves para leer los resultados y lo que viene para la integración." "Diego Salazar"
  CARD "Internacional" "Deuda y organismos: qué discuten los países del bloque" "Una agenda común frente al FMI que avanza a paso lento." "Diego Salazar"
  CARD "Internacional · Ambiente" "Amazonía: el acuerdo que promete y las cifras que preocupan" "Deforestación, financiamiento y promesas incumplidas." "Marina Kordon"
  CARD "Internacional" "Migración: rutas, muros y la economía que sostiene el viaje" "Crónica de un corredor migratorio que cambió de forma." "Marina Kordon"
  CARD "Internacional" "Litio del triángulo: quién compra y quién decide" "El mapa de contratos que redefine la geopolítica del recurso." "Diego Salazar"
  CARD "Internacional" "Prensa bajo presión: informe regional sobre libertad de expresión" "Los datos de un año difícil para el periodismo independiente." "Marina Kordon"
)"

gen economia.html "Economía" "Números que se sienten en el bolsillo: precios, deuda, salarios y quién gana con cada medida." "$(
  CARD "Economía" "Vencimientos con el FMI: qué se juega el país en septiembre" "Mapa de pagos, reservas disponibles y escenarios de los analistas." "Diego Salazar"
  CARD "Economía" "Inflación de agosto: qué rubros empujan el índice" "Alimentos y tarifas vuelven a marcar el ritmo mensual." "Diego Salazar"
  CARD "Economía · Trabajo" "Paritarias: cuánto le ganó (o perdió) el salario a los precios" "Un repaso sector por sector del último semestre." "Marina Kordon"
  CARD "Economía" "Economía popular: el trabajo que sostiene a cuatro millones" "Radiografía de un sector que no aparece en las estadísticas oficiales." "Marina Kordon"
  CARD "Economía" "Tarifas: el nuevo esquema de subsidios, explicado" "Quiénes pagan más, quiénes mantienen la ayuda y por qué." "Diego Salazar"
  CARD "Economía" "Dólar y reservas: el tablero que mira el mercado" "Las variables que definen las próximas semanas." "Diego Salazar"
)"

gen derechos.html "Derechos" "Derechos humanos, ambiente, género y salud. Los temas que inciden en el entorno social de cada comunidad." "$(
  CARD "Derechos · Ambiente" "Comunidades del altiplano frenan un proyecto de litio por el agua" "La Justicia ordenó suspender la exploración hasta que haya consulta previa." "Marina Kordon"
  CARD "Derechos · Salud" "Salud mental: los equipos denuncian que faltan camas y personal" "A seis años de la ley, el primer nivel sigue sin financiamiento sostenido." "Diego Salazar"
  CARD "Derechos" "Acceso a la vivienda: los números de la emergencia habitacional" "Alquileres, informalidad y las políticas que no llegan." "Marina Kordon"
  CARD "Derechos · Género" "Femicidios: qué dicen los registros y qué falta medir" "La brecha entre los datos oficiales y los de las organizaciones." "Marina Kordon"
  CARD "Derechos" "Pueblos indígenas: el mapa de conflictos territoriales sin resolver" "Relevamientos frenados y comunidades a la espera de la ley." "Diego Salazar"
  CARD "Derechos · Ambiente" "Humedales: el proyecto de ley que vuelve a foja cero" "Cinco años de debate y un texto que sigue sin dictamen." "Marina Kordon"
)"

gen opinion.html "Opinión" "Columnas y editoriales de Kitus y su red de colaboradores y colaboradoras." "$(
  CARD "Columna · Diego Salazar" "Las palabras también gobiernan" "Cómo el vocabulario del ajuste se volvió sentido común." "Diego Salazar"
  CARD "Columna · Marina Kordon" "Quién paga el ajuste cuando nadie lo nombra" "Una lectura de los costos invisibles de la agenda económica." "Marina Kordon"
  CARD "Editorial" "Por qué Kitus no va a tener muro de pago" "Nuestra posición sobre el acceso abierto a la información." "Editorial"
  CARD "Colaboración" "Cartografías del descontento: notas desde el sur" "Un ensayo sobre la protesta social y sus nuevas formas." "Red de colaboración"
  CARD "Columna · Diego Salazar" "El periodismo que viene: menos primicia, más contexto" "Contra la lógica del minuto a minuto." "Diego Salazar"
  CARD "Colaboración" "Traducir es tomar partido" "Sobre el trabajo de la red internacional de Kitus." "Red de colaboración"
)"

gen cultura.html "Cultura" "Arte, ideas y producción audiovisual que dan visibilidad a lo que los grandes medios no muestran." "$(
  CARD "Cultura" "El cine documental que mira lo que los grandes medios no muestran" "Un circuito de salas y festivales sostiene la producción independiente." "Marina Kordon"
  CARD "Cultura" "Editoriales autogestivas: cómo se publica por fuera del mercado" "Catálogos, ferias y redes que sostienen otra manera de leer." "Marina Kordon"
  CARD "Cultura" "Muralismo y memoria: el arte que disputa el espacio público" "Recorrido por intervenciones que cuentan otra historia de la ciudad." "Diego Salazar"
  CARD "Cultura" "Podcast y radios comunitarias: el mapa sonoro del país" "Quién produce, quién escucha y con qué recursos." "Diego Salazar"
  CARD "Cultura" "Archivos en peligro: la pelea por conservar la memoria audiovisual" "Material histórico que se pierde por falta de presupuesto." "Marina Kordon"
  CARD "Cultura" "Teatro independiente: la escena que resiste a la crisis" "Salas, elencos y públicos en un año difícil." "Diego Salazar"
)"

echo "Listo."
