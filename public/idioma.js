(() => {
  const selector = document.getElementById("idioma-sitio");
  if (!selector) return;
  const preferido = localStorage.getItem("kitus-idioma") || navigator.language;
  const opcion = [...selector.options].find((item) => preferido === item.value || preferido.startsWith(item.value + "-"));
  if (opcion) selector.value = opcion.value;
  const aplicar = () => {
    document.documentElement.lang = selector.value;
    document.documentElement.dir = selector.value === "ar" ? "rtl" : "ltr";
  };
  aplicar();
  selector.addEventListener("change", () => {
    localStorage.setItem("kitus-idioma", selector.value);
    aplicar();
  });
})();