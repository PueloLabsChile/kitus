---
titulo: "Ni el frigorífico del supermercado está a salvo de ciberataques"
bajada: "A finales de octubre(https://www.securityweek.com/supermarket-refrigeration-attack-widens-to-copeland-dixell-controllers/) alguien manipuló las neveras y congeladores de diferentes supermercados en Francia y Países Bajos para alterar la…"
seccion: internacional
autor: medios-aliados
fecha: 2026-11-05
fechaIncorporacion: 2026-11-05T14:57:01.353Z
etiquetas: ["The Conversation España"]
origen: sindicada
firma: "The Conversation España"
fuente: "The Conversation España"
fuenteUrl: "https://theconversation.com/es/"
original: "https://theconversation.com/ni-el-frigorifico-del-supermercado-esta-a-salvo-de-ciberataques-295803"
licencia: "CC BY-ND 4.0"
licenciaUrl: "https://creativecommons.org/licenses/by-nd/4.0/deed.es"
---
[A finales de octubre](https://www.securityweek.com/supermarket-refrigeration-attack-widens-to-copeland-dixell-controllers/) alguien manipuló las neveras y congeladores de diferentes supermercados en Francia y Países Bajos para alterar la cadena de frío y estropear los alimentos perecederos que almacenaban. [En los primeros días de noviembre](https://www.bbc.com/news/articles/cwy8lm1m59mvo) han tenido lugar incidentes parecidos en tiendas y cadenas en Bélgica, Luxemburgo, Suecia, Finlandia, Irlanda, Estonia, Italia, Alemania y Portugal.

Obviamente, la reacción inmediata tras todos estos incidentes ha consistido en retirar de la venta los productos refrigerados y congelados, desechar las existencias en mal estado, restablecer los sistemas de refrigeración y reponer todos los alimentos que se han echado a perder.

Lo que hay detrás de ese incidente masivo son ciberataques. Por norma general, cuando pensamos en este tipo de acciones nos imaginamos a atacantes que acceden a nuestros datos personales sin permiso (como nuestro número de teléfono o nuestro número de cuenta bancaria), o que nos impiden entrar en la página web del banco. Nos acordamos con menos frecuencia de los ataques que afectan a sistemas ciberfísicos o a sistemas OT (*Operational Technology*, por sus siglas en inglés). Es decir, a sistemas en los que procesadores, sensores, actuadores y redes están estrechamente vinculados a elementos físicos (como un frigorífico), de modo que se pueda observar el mundo real y modificarlo o controlarlo directamente.

Estos sistemas se encuentran casi siempre en fábricas, edificios o grandes infraestructuras como aeropuertos, centrales nucleares o presas. Los ataques que los afectan tienen consecuencias que se observan directamente en el mundo real. Y esto es lo que está ocurriendo en las últimas semanas en diferentes cadenas de supermercados europeas como Carrefour, Spar, ICA, Coop, Delhaize o SuperValu.

## Neveras y congeladores conectados a Internet

Lo primero que uno se pregunta es: ¿de verdad las neveras y congeladores de este tipo de establecimientos están conectadas a internet? Y la respuesta es que sí. Las cadenas de frío de los supermercados modernos emplean controladores de refrigeración conectados a la red, ya sea de manera aislada o de manera integrada con la gestión del resto de sistemas de la tienda. Esto permite al personal supervisar la temperatura, ajustar la configuración, recibir y verificar alarmas en caso de que algo falle y ajustar la configuración los equipos de forma remota siempre que sea necesario.

Si revisamos los ciberataques de los últimos años, observamos que no se trata de un hecho aislado. En el pasado, atacantes externos han accedido a través de internet a válvulas o elementos mecánicos en plantas de potabilización de aguas o perforación petrolífera (incluso en pistas de patinaje sobre hielo), cerraduras electrónicas, cámaras de videovigilancia, controladores de ascensores, sistemas de riego agrícola o de control de fuentes urbanas, señales de tráfico o tecnología asociada a los aparcamientos de coches.

## ¿Cómo ha podido pasar?

El riesgo surge cuando no solo se expone a internet un canal de actualización o monitorización seguro, sino una interfaz de gestión completa que permite realizar todo tipo de tareas de manera remota. Si un dispositivo puede realizar acciones físicas (calentar, enfriar, desbloquear, dosificar, bombear o activar y desactivar algún elemento) se debería procurar, siempre que sea posible, que no esté expuesto a internet directamente, sino conectado a redes internas mucho más protegidas y a las que es más difícil acceder desde el exterior. Es lo que se conoce como [segmentación de redes](https://www.incibe.es/incibe-cert/blog/microsegmentacion-de-redes-industriales), y consiste en dividir una red informática grande en subredes o zonas más pequeñas e independientes para controlar mejor el tráfico y reforzar la seguridad.

Si no queda más remedio que disponer de una interfaz web o panel de acceso remoto en la nube, en internet, debe estar protegido. Aunque no se han publicado todavía análisis forenses detallados y definitivos de los incidentes de los últimos días, si nos guiamos por lo que ocurre habitualmente, se deberán, con mucha probabilidad, a dos tipos de causas.

La primera de ellas tiene que ver con una pobre gestión de identidades y accesos. ¿Quién debería estar autorizado para acceder a una interfaz de gestión completa de las neveras? Pocas personas, que además tienen que poder identificarse, demostrar que son quienes dicen ser y que tienen los permisos adecuados para hacer lo que solicitan cada vez que se conectan.

Si cuando se conectan las neveras en los supermercados nadie cae en la cuenta de que están exponiendo una interfaz de gestión completa a internet y [se dejan estos paneles con un usuario y contraseña por defecto (por ejemplo, los clásicos ADMIN y 1234)](https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/deliver/index/docId/117583/file/117583.pdf), cualquiera que encuentre estos interfaces podrá entrar en ellos y hacer lo que quiera; por ejemplo, poner el refrigerador en modo “descongelar” o subir la temperatura a 50º C.

Otra opción es que no se haya habilitado el [doble factor de autenticación](https://www.incibe.es/ciudadania/tematicas/contrasenas-seguras/autenticacion-de-dos-factores) y se haya fiado toda la seguridad a una contraseña. Que puede no ser 1234, pero sí ser débil (fácil de adivinar o de “romper por fuerza bruta”). O tal vez se haya visto expuesta en una brecha de datos.

## Puertas de entrada descuidadas

La segunda posibilidad, más allá de contraseñas y accesos, tiene que ver con una pobre gestión del *firmware*. Es decir, del *software* que viene preinstalado de fábrica que se encarga de funciones básicas como el arranque o la interacción con el sistema operativo. En muchos casos [se van descubriendo vulnerabilidades](https://claroty.com/team82/research/freeze-the-controller-defrost-the-food-uncovering-vulnerabilities-in-danfoss-refrigeration-controllers) en él, que los atacantes aprenden a explotar para conseguir sus objetivos.

Si nadie está pendiente de actualizar o parchear este *firmware* para que se “cierren” posibles puertas de entrada, o si hacerlo es costoso porque implica apagar las neveras y nunca es buen momento para hacerlo, los atacantes lo tienen relativamente fácil. Sobre todo hoy en día, con la inteligencia artificial ayudando en todas estas tareas ofensivas.

## El objetivo detrás de este tipo de ciberataques

¿Y por qué alguien atacaría a las neveras de los supermercados europeos? De momento ningún grupo ha reivindicado la autoría de estos ataques. Podría haber intereses privados detrás, mafias que quieren pedir rescates o que han sido contratadas para socavar la confianza en la competencia. Pero al ser ataques tan extendidos, que afectan a países y cadenas diferentes, surge la sospecha de que alguien pretende perturbar operaciones básicas con impacto en la vida cotidiana de los ciudadanos, destruir existencias, provocar pérdidas económicas y socavar la confianza en el suministro de alimentos.

Diferentes informes y [declaraciones](https://www.politico.eu/article/european-commission-probe-supermarket-cyberattack-christophe-hansen/) han expresado preocupación ante la posibilidad de [ataques híbridos respaldados por estados](https://theconversation.com/ciberataques-para-desestabilizar-al-adversario-otra-arma-en-la-guerra-encubierta-176858).

¿Qué deben hacer los supermercados a partir de ahora? Para empezar, aprender de lo ocurrido y aplicar los principios de defensa en profundidad (redes segmentadas, nada de contraseñas por defecto, doble factor de autenticación, actualización del *firmware*, etc.), mínimo privilegio (cada miembro del personal tiene que acceder exclusivamente a aquello que necesita para realizar su trabajo) y mínima superficie de exposición (sólo deben quedar accesibles desde internet aquellos elementos en los que este acceso sea estrictamente necesario).

Para poder hacer esto tienen que empezar por conocer qué tienen conectado, qué amenazas les afectan y qué impactos podrían implicar si se materializaran. Con evidencia en la mano, no guiándose por intuiciones.

*Marta Beltrán trabaja como Digital Risk Lab Leader en WTW.*

---

*Publicado originalmente en [The Conversation España](https://theconversation.com/ni-el-frigorifico-del-supermercado-esta-a-salvo-de-ciberataques-295803) el 5 de noviembre de 2026. Reproducido por Kitus bajo licencia [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/deed.es). El texto no fue modificado.*
