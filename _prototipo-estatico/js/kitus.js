/* KITUS — interacciones mínimas del prototipo */
(function () {
  "use strict";

  // Año dinámico en el pie
  document.querySelectorAll("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Marca el enlace de navegación de la sección actual
  var ruta = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === ruta) a.setAttribute("aria-current", "page");
  });

  // Alta al boletín (demo: no envía nada, solo confirma)
  document.querySelectorAll("form[data-boletin]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var campo = form.querySelector("input[type=email]");
      var ok = form.querySelector("[data-boletin-ok]");
      if (campo && campo.value && ok) {
        ok.hidden = false;
        ok.textContent = "Listo, " + campo.value + " quedó anotada. (Demo — todavía no hay envío real.)";
        form.reset();
      }
    });
  });
})();
