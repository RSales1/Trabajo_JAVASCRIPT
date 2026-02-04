// Configuración visual de la galería usando efectos 3D para mejorar la experiencia del usuario

// Esperamos a que cargue todo el HTML primero
document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.querySelector(".swiper");
  
    // Si no estamos en la página de galería, salimos
    if (!contenedor) return;
  
    // Si Swiper no está cargado, evitamos errores
    if (typeof Swiper === "undefined") {
        console.error("La librería Swiper no está cargada.");
        return;
    }

    // Inicialización de Swiper para galería
    const swiper = new Swiper('.swiper', {
        loop: true, // Galería en bucle infinito

        autoplay: {
            delay: 3000, // Cambia el slide cada 3 segundos
            disableOnInteraction: false, // No se detiene al interactuar
        },

        pagination: {
            el: '.swiper-pagination', // Elemento de puntos
            clickable: true, // Los puntos son clicables
        },

        navigation: {
            nextEl: '.swiper-button-next', // Flecha siguiente
            prevEl: '.swiper-button-prev', // Flecha anterior
        },

        effect: 'coverflow', // Efecto 3D 
        grabCursor: true, // Cursor tipo mano
        centeredSlides: true, // Centra la imagen
        slidesPerView: 'auto', // Ajusta automáticamente el número de imágenes visibles según el tamaño del contenedor

        coverflowEffect: {
            rotate: 30, // Ángulo de rotación de las imágenes laterales. Da sensación de profundidad 3D
            depth: 200, // Distancia en el eje Z, controla el efecto de profundidad de las imágenes
            modifier: 1, // Intensidad del efecto 3D
            slideShadows: true, // Sombras 3D
        },
    })
});