// Esperamos a que cargue todo el HTML primero
document.addEventListener("DOMContentLoaded", () => {
    let noticias = [];
    let indice = 0;
    let timerId = null;

    const titulo = document.getElementById("titulo");
    const texto = document.getElementById("texto");
    const fecha = document.getElementById("fecha");

    // Si no estamos en la página que contiene estos elementos, salimos
    if (!titulo || !texto || !fecha) return;

    function mostrarNoticia() {
        if (!noticias.length) return;

        const noticia = noticias[indice];

        titulo.textContent = noticia?.titulo ?? "";
        texto.textContent = Array.isArray(noticia?.texto) ? noticia.texto.join(" ") : (noticia?.texto ?? "");
        fecha.textContent = noticia?.fecha ?? "";
    }

    function cambiarNoticia() {
        if (!noticias.length) return;

        indice = (indice + 1) % noticias.length;
        mostrarNoticia();
    }

    // Se cargan noticias desde JSON
    fetch("data/noticias.json")
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then((data) => {
            // Solo acepta arrays, si no, se convierte en array vacío
            noticias = Array.isArray(data) ? data : [];
            indice = 0;

            mostrarNoticia();

            // Arranca intervalo si hay más de 1 noticia
            if (noticias.length > 1) {
                timerId = setInterval(cambiarNoticia, 4000);
            }
        })
        .catch((error) => {
            console.error("Error cargando noticias:", error);
            // Se dejan los campos vacíos si falla
            titulo.textContent = "";
            texto.textContent = "";
            fecha.textContent = "";
            if (timerId) clearInterval(timerId);
        });
});