---
titulo: "Cuando el fútbol apaga internet: el impacto de los bloqueos indiscriminados de IP"
bajada: "Al principio de internet, cada web podía compararse con una casa que tenía una dirección propia: la dirección IP(https://es.wikipedia.org/wiki/Direcci%C3%B3nIP). El listín en el cual podemos encontrar la IP de una web es el DNS. Hoy, la…"
seccion: internacional
autor: medios-aliados
fecha: 2026-10-14
fechaIncorporacion: 2026-10-14T13:05:02.302Z
etiquetas: ["The Conversation España"]
origen: sindicada
firma: "The Conversation España"
fuente: "The Conversation España"
fuenteUrl: "https://theconversation.com/es/"
original: "https://theconversation.com/cuando-el-futbol-apaga-internet-el-impacto-de-los-bloqueos-indiscriminados-de-ip-292390"
licencia: "CC BY-ND 4.0"
licenciaUrl: "https://creativecommons.org/licenses/by-nd/4.0/deed.es"
---
Al principio de internet, cada web podía compararse con una casa que tenía una dirección propia: [la dirección IP](https://es.wikipedia.org/wiki/Direcci%C3%B3n_IP). El listín en el cual podemos encontrar la IP de una web es el DNS. Hoy, la situación ha cambiado: muchas páginas comparten “edificio” y “puerta de entrada”. Las [redes de distribución de contenido (CDN)](https://es.wikipedia.org/wiki/Red_de_distribuci%C3%B3n_de_contenidos), como [Cloudflare](https://blog.cloudflare.com/announcing-encrypted-client-hello/), Vercel, Amazon CloudFront o Fastly, alojan cientos o miles de servicios bajo una misma IP. De esta forma, el DNS redirige el tráfico de miles de empresas e instituciones a una misma entrada digital (ese gran edificio de oficinas compartidas).

Por eso, cuando un sistema detecta una emisión ilegal en una web –por ejemplo, la retransmisión pirata de un partido de fútbol–, bloquear su IP equivale a tapiar la entrada de todo el edificio, en lugar de cerrar una sola oficina. El método es rápido, pero impide el acceso a servicios que no tienen ninguna relación con la infracción; entre ellos, plataformas de pago en línea, medios de comunicación o redes de servicios sanitarios.

## ¿Cómo funcionan los bloqueos dinámicos?

Hay dos métodos principales. En primer lugar, el bloqueo DNS elimina el nombre de una “tienda” del “callejero”: es relativamente preciso, aunque puede eludirse usando otro sistema de resolución (siempre podemos tener una copia del callejero). Y en segundo lugar, el bloqueo por IP corta todas las conexiones dirigidas a una dirección postal compartida.

Desde diciembre de 2024, la [sentencia 310/2024 del Juzgado de lo Mercantil número 6 de Barcelona](https://www.iberley.es/jurisprudencia/sentencia-civil-juzgado-lo-mercantil-n-6-18-12-24-48656190) permite ordenar el bloqueo e interrupción inmediata del acceso a nuevas direcciones IP y dominios asociados a retransmisiones ilegales detectadas durante los partidos de fútbol. Esto significa que las operadoras de telecomunicaciones deben responder a las peticiones y aplicar esos cortes sin revisión judicial individual.

## Los daños colaterales, en cifras

Durante el segundo semestre de 2025, se difundió en redes sociales, bajo la etiqueta #laligagate, un llamamiento para dar visibilidad a los cortes observados en [hayahora.futbol](https://hayahora.futbol/), una página web española que funciona como un monitor en tiempo real de los bloqueos de direcciones IP ordenados por LaLiga contra la piratería de partidos de fútbol.

El objetivo era contrastarlos con mediciones de la [plataforma OONI](https://ooni.org/), especializada en detectar censura en internet. Por separado, los registros publicados por hayahora.futbol y el [informe de OONI](https://ooni.org/post/2026-laliga-collateral/) documentan la dimensión del problema. OONI analizó más de nueve millones de webs españolas: unas 7 400 IP bloqueadas afectaron al 5,8 % de las páginas, es decir, más de 554 000 servicios legítimos. En momentos de máxima actividad, bloquear entre cuatro y veinte IP dejó inaccesibles más de 400 000 páginas.

Estos datos contradicen la idea de que los bloqueos causan pocos daños colaterales.

Para hacernos una idea, se han registrado interrupciones de la plataforma de gestión de pagos en línea [Redsys](https://es.euronews.com/next/2026/09/18/si-hay-un-partido-de-futbol-en-espana-dejan-de-funcionar-miles-de-webs-y-servicios-de-inte), páginas de ONG, medios de comunicación, universidades, farmacias, servicios sanitarios y plataformas de desarrollo de *software*.

La [Plataforma de Afectados por LaLiga](https://afectadosporlaliga.palbin.com/) estima en 3 203 500 euros las pérdidas económicas causadas por estos cortes, según datos aportados por algunos afectados.

Sin embargo, las consecuencias no son solo económicas: los bloqueos podrían afectar a derechos constitucionales como la libertad de información, la protección de la salud y la libertad de actividad económica. Por ello, la organización de la conferencia de ciberseguridad [RootedCon](https://es.wikipedia.org/wiki/RootedCON) ha presentado un [recurso ante el Tribunal Constitucional](https://forbes.es/economia/711961/amrootedcon-recurre-al-constitucional-el-fallo-que-permite-el-bloqueo-de-webs-pedido-por-laliga-y-telefonica/) contra la sentencia que permite a LaLiga y a Telefónica el bloqueo indiscriminado. Mientras, la Asociación de Internautas [ha solicitado amparo al Defensor del Pueblo](https://internautas.org/defensor-del-pueblo/).

## Por qué los piratas escapan

Para entender parte de la dificultad a la hora de bloquear sitios webs de piratería, hace falta comprender el concepto de [IPv4](https://es.wikipedia.org/wiki/IPv4) e [IPv6](https://es.wikipedia.org/wiki/IPv6). IPv4 es el sistema tradicional, que usa 32 bits para localizar una web. Con este procedimiento, existen un total de 2³² (unos 4 300 millones) de direcciones. El volumen de recursos en internet hace que ese número total de direcciones sea insuficiente, motivo por el cual los CDN agrupan miles de webs bajo una misma IP.

Por otro lado, con IPv6, cada dirección consta de 128 bits, lo que hace posible un total de 2¹²⁸ –340 sextillones– de direcciones. Esto permitiría asignar de forma individual IP a muchos más recursos en internet y, por lo menos teóricamente, llevar a cabo bloqueos quirúrgicos, evitando afectados colaterales.

En la actualidad, como IPv4 e IPv6 conviven, cuando una transmisión o web ilícita detecta que su IPv4 ha sido bloqueada, puede pasar a una [IPv6](https://research.utwente.nl/en/publications/90th-minute-a-first-look-to-collateral-damages-and-efficacy-of-th/) en cuestión de minutos. Las pequeñas empresas, en cambio, suelen carecer de personal técnico para migrar sus servicios. Si comparten IPv4 con una web perseguida, pueden quedar desconectadas durante horas o días sin saber qué ocurre ni cómo reclamar.

## Geopolítica digital

El problema es internacional. [Más del 85 % de los servicios CDN dependen](https://w3techs.com/technologies/overview/proxy/) de grandes proveedores norteamericanos como Cloudflare, Vercel, AWS o Google. Esta concentración crea [puntos únicos de fallo](https://es.wikipedia.org/wiki/Punto_%C3%BAnico_de_fallo) –SPOF, por sus siglas en inglés–: un bloqueo o una interrupción en un proveedor puede afectar a miles de servicios. Así, los bloqueos nacionales pueden fragmentar la red y dañar la resiliencia y confianza digitales europeas.

El problema afecta también al desarrollo de la inteligencia artificial. Las herramientas de IA dependen de la nube y de infraestructuras distribuidas para entrenarse y funcionar. Un país que permite apagones digitales aleatorios sobre servicios legítimos debilita las bases técnicas de una IA responsable y reduce la confianza de inversores y usuarios en su ecosistema tecnológico.

## Cómo podría solucionarse

La protección de la propiedad intelectual debe equilibrarse con el interés general. Es decir, debe velar por la neutralidad de la red, la interoperabilidad y el funcionamiento de los servicios legítimos. Para lograrlo, combatir la piratería exige medidas proporcionales, transparentes y revisables, como:

- Abandonar el bloqueo ciego de IP compartidas y priorizar dominios completos o URL específicas.

- Establecer el bloqueo de red como medida de ultima ratio , según el principio de intervención mínima. Se puede exigir legalmente a los titulares de derechos que agoten de forma rigurosa las notificaciones de retirada directa ante los proveedores de alojamiento ( hosting ) que albergan la señal ilícita, antes de poder requerir intervenciones drásticas e indiscriminadas en la infraestructura de transporte de los operadores de internet (ISP).

- Publicar registros consultables de los recursos bloqueados para permitir auditorías y detectar errores.

- Crear canales ágiles, gestionados por organismos neutrales, para corregir falsos positivos e indemnizar a terceros lícitos.

- Acelerar la transición a IPv6, reduciendo la dependencia de direcciones IPv4 compartidas y escasas.

*David Arroyo Guardeño no recibe salario, ni ejerce labores de consultoría, ni posee acciones, ni recibe financiación de ninguna compañía u organización que pueda obtener beneficio de este artículo, y ha declarado carecer de vínculos relevantes más allá del cargo académico citado.*

---

*Publicado originalmente en [The Conversation España](https://theconversation.com/cuando-el-futbol-apaga-internet-el-impacto-de-los-bloqueos-indiscriminados-de-ip-292390) el 14 de octubre de 2026. Reproducido por Kitus bajo licencia [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/deed.es). El texto no fue modificado.*
