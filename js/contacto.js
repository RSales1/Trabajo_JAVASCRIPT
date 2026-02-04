// Esperamos a que cargue todo el HTML primero
document.addEventListener("DOMContentLoaded", () => {
    const mapaDiv = document.getElementById("mapa");
    if (!mapaDiv) return;
    
    // Seguridad: si Leaflet o el plugin no cargan, evitamos errores
    if (typeof L === "undefined") {
        console.error("Leaflet no está cargado.");
        return;
    }
    if (!L.Routing) {
        console.error("Leaflet Routing Machine no está cargado.");
        return;
    }
    
    // Ubicación de la empresa 
    const novacore = L.latLng(37.489309463705716, -5.928645745230546);
    
    // Mapa base
    const map = L.map("mapa", {
        zoomControl: true,
        scrollWheelZoom: false, // evita “secuestrar” el scroll en móvil/portátil
    }).setView(novacore, 13);
    
    // Capa OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);
    
    // Marcador empresa
    L.marker(novacore)
    .addTo(map)
    .bindPopup("<strong>NovaCore</strong><br>Calle Isaac Newton, nº 12")
    .openPopup();
    
    // Control de rutas (se crea una vez y se reutiliza)
    const routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: false,
        addWaypoints: false,
        show: true,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        lineOptions: {
            styles: [{ opacity: 0.9, weight: 5 }],
        },
        // Router Open Source Rooting Machine público 
        router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
    }).addTo(map);
    
    function calcularRuta(origen) {
        routingControl.setWaypoints([origen, novacore]);
    }
    
    // Si el usuario permite geolocalización: ruta real
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const origen = L.latLng(pos.coords.latitude, pos.coords.longitude);
                
                // Marcador cliente
                L.marker(origen)
                .addTo(map)
                .bindPopup("<strong>Tú estás aquí</strong>")
                .openPopup();
                
                calcularRuta(origen);
            },
            (err) => {
                console.warn("Geolocalización denegada o fallida:", err);
                
                // Ruta de ejemplo (para que se vea el funcionamiento)
                const ejemplo = L.latLng(37.3891, -5.9845); // Sevilla centro aprox.
                L.marker(ejemplo).addTo(map).bindPopup("<strong>Ubicación de ejemplo</strong>");
                
                calcularRuta(ejemplo);
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    } else {
        console.warn("Este navegador no soporta geolocalización.");
        
        // Ruta de ejemplo
        const ejemplo = L.latLng(37.3891, -5.9845);
        L.marker(ejemplo).addTo(map).bindPopup("<strong>Ubicación de ejemplo</strong>");
        
        calcularRuta(ejemplo);
    }
});