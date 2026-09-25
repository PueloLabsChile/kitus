(() => {
  const selector = document.getElementById("idioma-sitio");
  if (!selector) return;

  const idiomaOriginal = "es";
  const preferido = localStorage.getItem("kitus-idioma") || idiomaOriginal;
  const opcion = [...selector.options].find((item) => item.value === preferido);
  if (opcion) selector.value = opcion.value;

  selector.addEventListener("change", () => {
    const destino = selector.value;
    localStorage.setItem("kitus-idioma", destino);
    if (destino === idiomaOriginal) {
      window.location.assign("/");
      return;
    }
    const traducida = new URL("https://translate.google.com/translate");
    traducida.searchParams.set("sl", idiomaOriginal);
    traducida.searchParams.set("tl", destino);
    traducida.searchParams.set("u", window.location.href);
    window.location.assign(traducida.href);
  });
})();