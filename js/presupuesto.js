// Esperamos a que cargue todo el HTML primero
document.addEventListener("DOMContentLoaded", () => {

    // Referencia al formulario (si no existe, no hace nada)
    const formulario = document.getElementById("formulario");
    if (!formulario) return;
    
    // Referencias a elementos del formulario
    const producto = document.getElementById("producto");
    const plazo = document.getElementById("plazo");
    const extrasCheckboxes = document.querySelectorAll('input[name="extras"]');
    
    const totalInput = document.getElementById("total");
    const descuentoMensaje = document.getElementById("descuentoMensaje");
    
    const botonEnviar = formulario.querySelector('button[type="submit"]');
    
    // Si faltara algo crítico, salimos para evitar errores en consola
    if (!producto || !plazo || !totalInput || !descuentoMensaje || !botonEnviar) return;
    
    // Función auxiliar para mostrar formato en euros
    function formatearEuros(valor) {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
        }).format(valor);
    }
    
    // Cálculo del total: producto + extras - descuento por plazo
    function calcularTotal() {
        let total = 0;
        
        // Producto base (si no hay selección válida, será 0)
        const productoValor = parseFloat(producto.value) || 0;
        total += productoValor;
        
        // Extras seleccionados (checkbox)
        extrasCheckboxes.forEach((cb) => {
            if (cb.checked) {
                total += parseFloat(cb.value) || 0;
            }
        });
        
        // Descuento según meses (solo si hay producto y plazo)
        const meses = parseInt(plazo.value, 10) || 0;
        let descuentoAplicado = 0;
        
        if (productoValor > 0 && meses > 0) {
            if (meses >= 6) {
                total *= 0.90; // descuento del 10%
                descuentoAplicado = 10;
            } else if (meses >= 3) {
                total *= 0.95; // descuento del 5%
                descuentoAplicado = 5;
            }
        }
        
        // Mostrar total en el input readonly
        totalInput.value = formatearEuros(total);
        
        // Mostrar mensaje de descuento si aplica
        if (descuentoAplicado > 0) {
            descuentoMensaje.textContent = `Se ha aplicado un descuento del ${descuentoAplicado}%.`;
            descuentoMensaje.classList.add("ok");
        } else {
            descuentoMensaje.textContent = "";
            descuentoMensaje.classList.remove("ok");
        }
    }
    
    // Habilitar/deshabilitar botón según validez del formulario
    function actualizarBoton() {
        botonEnviar.disabled = !formulario.checkValidity();  // checkValidity() evalúa required, pattern, min, type=email, etc.
    }
    
    // Eventos: recalcular total y validar en tiempo real
    producto.addEventListener("change", () => {
        calcularTotal();
        actualizarBoton();
    });
    
    plazo.addEventListener("input", () => {
        calcularTotal();
        actualizarBoton();
    });
    
    extrasCheckboxes.forEach((cb) => {
        cb.addEventListener("change", () => {
            calcularTotal();
            actualizarBoton();
        });
    });
    
    // Validación continua para inputs y selects
    const campos = formulario.querySelectorAll("input, select");
    campos.forEach((campo) => {
        campo.addEventListener("input", actualizarBoton);
        campo.addEventListener("change", actualizarBoton);
    });
    
    // Control del submit: si hay errores, se cancela y muestra mensajes del navegador
    formulario.addEventListener("submit", (e) => {
        if (!formulario.checkValidity()) {
            e.preventDefault();
            formulario.reportValidity();
        }
    });
    
    // Inicialización (al cargar la página)
    calcularTotal();
    actualizarBoton();
});