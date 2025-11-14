document.addEventListener("DOMContentLoaded", function() {

    // --- NUEVO: Objeto con las líneas de negocio ---
    const lineasPorUnidad = {
        "Salud": [
            "Director Salud", "Prestación Salud", "Ejecutivo EPS y Consorcio", 
            "Planeación", "Planes voluntarios", "TI", "Servicios Ambulatorios", 
            "Inmunización", "Cirugía", "Salud Oral", "Laboratorio", "Patología"
        ],
        "Bienestar y Desarrollo": [
            "Director bienestar", "Mercadeo", "R+D", "Educación", 
            "Empleo y fomento empresarial", "Subsidio", "Vivienda", "Eventos", 
            "Alimentos", "Alojamiento", "TI"
        ],
        "Financiamiento y Alianzas": [
            "Director Financiamiento", "Planeación", "Servicios Financieros", 
            "Crecimiento digital", "Operador de información", 
            "Convenios y alianzas", "Mercadeo y comercial", "TI"
        ]
    };
    
    // --- PARTE 0: LÓGICA DE PASOS (Actualizada) ---
    const selectorUnidad = document.getElementById('unidad');
    const selectorLinea = document.getElementById('lineaNegocio'); // El 2do dropdown
    const paso2 = document.getElementById('paso-2');

    selectorUnidad.addEventListener('change', function() {
        const unidadSeleccionada = this.value;

        // 1. Limpiar el dropdown de líneas de negocio
        selectorLinea.innerHTML = '<option value="">-- Selecciona una opción --</option>';

        if (unidadSeleccionada) {
            // 2. Mostrar el Paso 2
            paso2.style.display = 'block';

            // 3. Poblar el dropdown de líneas de negocio
            const lineas = lineasPorUnidad[unidadSeleccionada];
            
            if (lineas) {
                lineas.forEach(linea => {
                    const opcion = document.createElement('option');
                    opcion.value = linea;
                    opcion.textContent = linea;
                    selectorLinea.appendChild(opcion);
                });
            }
            
        } else {
            // Si se deselecciona la unidad, ocultar el paso 2
            paso2.style.display = 'none';
        }
    });

    // --- PARTE 1: LÓGICA CONDICIONAL DE CHECKBOX (Sin cambios) ---

    // Lista de todos los ID de los checkboxes y sus campos correspondientes
    const procesos = [
        "Innovacion", "Estrategia", "Compras", "Juridicos",
        "Informacion", "Administracion", "Finanzas", "Plataforma"
    ];

    // Añadimos un "escuchador" a cada checkbox
    procesos.forEach(proceso => {
        const checkbox = document.getElementById(proceso.toLowerCase());
        const camposDiv = document.getElementById(`campos-${proceso}`);

        if (checkbox && camposDiv) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    camposDiv.classList.add('visible'); // Muestra los campos
                } else {
                    camposDiv.classList.remove('visible'); // Oculta los campos
                }
            });
        }
    });

    // --- PARTE 2: MANEJO DEL ENVÍO DEL FORMULARIO (Sin cambios) ---

    const formulario = document.getElementById('miFormulario');
    const botonEnviar = document.getElementById('submit-button');
    const mensajeStatus = document.getElementById('status-mensaje');

    // URL de tu Google Apps Script (¡ASEGÚRATE DE QUE ESTÉ TU URL!)
    const urlScript = 'https://script.google.com/macros/s/AKfycbyBFyhMmqMgF1_xODUkRTGRUI5sQJRNvJO_j-36jZiIoJV-Yv9xmTuD3SGlfIp5NXh6/exec'; 

    formulario.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue

        // Muestra un mensaje y deshabilita el botón
        mensajeStatus.textContent = 'Enviando... por favor espera.';
        mensajeStatus.style.color = '#333';
        botonEnviar.disabled = true;

        const formData = new FormData(formulario);

        fetch(urlScript, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                // Éxito
                mensajeStatus.textContent = '¡Solicitud enviada con éxito!';
                mensajeStatus.style.color = 'green';
                formulario.reset(); // Limpia el formulario
                
                // Oculta todos los campos de proceso de nuevo
                document.querySelectorAll('.proceso-campos').forEach(div => {
                    div.classList.remove('visible');
                });

                // Oculta el paso 2 y resetea el dropdown de líneas
                paso2.style.display = 'none';
                selectorLinea.innerHTML = '<option value="">-- Selecciona una opción --</option>';

                botonEnviar.disabled = false;
            } else {
                // Error manejado
                throw new Error(data.message || 'Error desconocido');
            }
        })
        .catch(error => {
            // Error de red o del script
            console.error('Error:', error);
            mensajeStatus.textContent = 'Error al enviar la solicitud. Intenta de nuevo.';
            mensajeStatus.style.color = 'red';
            botonEnviar.disabled = false;
        });
    });
});