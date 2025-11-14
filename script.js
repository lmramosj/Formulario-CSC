document.addEventListener("DOMContentLoaded", function() {

    // --- Objeto con las líneas de negocio ---
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
    
    // --- PARTE 0: LÓGICA DE PASOS ---
    const selectorUnidad = document.getElementById('unidad');
    const selectorLinea = document.getElementById('lineaNegocio');
    const paso2 = document.getElementById('paso-2');

    selectorUnidad.addEventListener('change', function() {
        const unidadSeleccionada = this.value;
        selectorLinea.innerHTML = '<option value="">-- Selecciona una opción --</option>';

        if (unidadSeleccionada) {
            paso2.style.display = 'block';
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
            paso2.style.display = 'none';
        }
    });

    // --- PARTE 1: LÓGICA CONDICIONAL DE CHECKBOX ---
    const procesos = [
        "Innovacion", "Estrategia", "Compras", "Juridicos",
        "Informacion", "Administracion", "Finanzas", "Plataforma"
    ];

    procesos.forEach(proceso => {
        const checkbox = document.getElementById(proceso.toLowerCase());
        const camposDiv = document.getElementById(`campos-${proceso}`);
        if (checkbox && camposDiv) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    camposDiv.classList.add('visible');
                } else {
                    camposDiv.classList.remove('visible');
                }
            });
        }
    });

    // --- PARTE 2: MANEJO DEL ENVÍO (CON LÓGICA DE REINTENTO) ---
    const formulario = document.getElementById('miFormulario');
    const botonEnviar = document.getElementById('submit-button');
    const mensajeStatus = document.getElementById('status-mensaje');
    const urlScript = 'TU_URL_DE_APPS_SCRIPT_AQUI'; // ¡Asegúrate que tu URL esté aquí!

    // Listener principal del formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        mensajeStatus.textContent = 'Enviando... por favor espera.';
        mensajeStatus.style.color = '#333';
        botonEnviar.disabled = true;

        // Inicia el primer intento de envío
        enviarFormulario(new FormData(formulario), 1); // Intento 1
    });

    // Función de envío que puede reintentar
    function enviarFormulario(formData, intento) {
        
        fetch(urlScript, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // ÉXITO
                mensajeStatus.textContent = '¡Gracias! Tu solicitud ha sido recibida.';
                mensajeStatus.style.color = 'green';
                botonEnviar.disabled = false; // Habilita el botón
                setTimeout(() => { mensajeStatus.textContent = ''; }, 4000); // Limpia el mensaje
            } else {
                // Falla del servidor (ej. 500)
                throw new Error('Fallo del servidor');
            }
        })
        .catch(error => {
            console.error('Error en intento ' + intento + ':', error);
            
            // Si es el primer intento, reintenta una vez
            if (intento === 1) {
                console.log('Reintentando envío...');
                setTimeout(() => {
                    enviarFormulario(formData, 2); // Intento 2
                }, 1000); // Espera 1 segundo
            } else {
                // Si falla en el segundo intento, muestra el error final
                mensajeStatus.textContent = 'Error al enviar la solicitud. Revisa tu conexión.';
                mensajeStatus.style.color = 'red';
                botonEnviar.disabled = false;
            }
        });
    }
});

