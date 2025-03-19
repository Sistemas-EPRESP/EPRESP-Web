// nonComplianceData.js

// Definición de la data de incumplimientos con la propiedad "tipo"
// que coincide con el valor recibido desde el backend.
const nonComplianceData = [
    {
        id: "omision-pago",
        tipo: "Omisión de pago", // Valor que debe coincidir con el backend
        label: "Omisión de pago",
        sanctions: [
            {
                id: "intereses-resarcitorios",
                label:
                    "Intereses resarcitorios (art. 21° Anexo Res. N° 38/2024 - EPRESP)",
            },
            {
                id: "multa-omision",
                label:
                    "Multa por omisión de pago (art. 25° y 26° Anexo Res. N° 38/2024 - EPRESP)",
            },
        ],
    },
    {
        id: "falta-presentacion-fr",
        tipo: "Falta de presentacion del FR", // Valor que debe coincidir con el backend
        label: "Falta de presentación de FR",
        sanctions: [
            {
                id: "multa-falta-presentacion-fr",
                label:
                    "Multa por falta de presentación de FR (art. 24° Anexo Res. N° 38/2024 - EPRESP)",
            },
        ],
    },
    // Se pueden agregar más incumplimientos aquí
];

export default nonComplianceData;
