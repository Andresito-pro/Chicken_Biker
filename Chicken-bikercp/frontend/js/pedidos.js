document.addEventListener('DOMContentLoaded', () => {
    const tipoPedido = document.getElementById('tipoPedido');
    const mesaSelect = document.getElementById('idMesa');

    // Función para gestionar el estado de la mesa
    const gestionarMesa = () => {
        if (tipoPedido.value === 'llevar') {
            // Si es para llevar, seleccionamos la opción N/A y deshabilitamos
            mesaSelect.value = "0"; 
            mesaSelect.disabled = true;
            mesaSelect.style.opacity = "0.6"; // Feedback visual de bloqueado
            mesaSelect.style.cursor = "not-allowed";
        } else {
            // Si es mesa, habilitamos el select
            mesaSelect.disabled = false;
            mesaSelect.style.opacity = "1";
            mesaSelect.style.cursor = "default";
            // Opcional: limpiar el valor para que el usuario elija una mesa real
            if(mesaSelect.value === "0") mesaSelect.value = "";
        }
    };

    // Escuchar el evento de cambio
    tipoPedido.addEventListener('change', gestionarMesa);
});