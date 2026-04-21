// LÓGICA DE PROCESAMIENTO DE DATOS REALES
const fileInput = document.getElementById('csvFileInput');

fileInput.addEventListener('change', function(evento) {
    const archivo = evento.target.files[0];
    
    if (!archivo) return;

    console.log("Archivo detectado, procesando...");

    Papa.parse(archivo, {
        header: true, // Asume que la primera fila tiene los nombres de las columnas
        dynamicTyping: true, // Convierte los números en texto a números reales
        complete: function(resultados) {
            // Aquí es donde ocurre la magia. Resultados.data es tu array con miles de filas.
            const datosBrutos = resultados.data;
            
            console.log("¡Datos cargados con éxito!");
            console.log(`Total de filas analizadas: ${datosBrutos.length}`);
            console.log("Muestra de la primera fila:", datosBrutos[0]);
            
            // EL SIGUIENTE RETO SERÁ AQUÍ:
            // Crear una función que coja 'datosBrutos', cuente los abandonos 
            // y actualice los gráficos de Chart.js automáticamente.
        },
        error: function(error) {
            console.error("Error al leer el CSV:", error);
        }
    });
});