
// Definimos la data de incumplimientos y sanciones
const nonComplianceData = [
    {
        id: "omision-pago",
        label: "Omisión de pago",
        sanctions: [
            {
                id: "intereses-resarcitorios",
                label: "Intereses resarcitorios (art. 21° Anexo Res. N° 38/2024 - EPRESP)",
            },
            {
                id: "multa-omision",
                label: "Multa por omisión de pago (art. 25° y 26° Anexo Res. N° 38/2024 - EPRESP)",
            },
        ],
    },
    // Se pueden agregar más incumplimientos aquí
];

export default nonComplianceData;
