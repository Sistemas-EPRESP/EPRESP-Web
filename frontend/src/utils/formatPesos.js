/**
 * Formatea un número al formato numérico argentino con 2 decimales.
 * No incluye el símbolo de moneda.
 *
 * @param {number} numero - Número a formatear.
 * @returns {string} Número formateado.
 */
export const formatPesos = (numero) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'decimal', // Se usa decimal para no incluir "$"
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numero);
};

/**
 * Desformatea un string con formato de pesos (por ejemplo, "40.500,00")
 * a un número, eliminando los separadores de miles y reemplazando la coma decimal por punto.
 *
 * @param {string | number} value - Valor formateado.
 * @returns {number} Valor numérico.
 */
export const parsePesos = (value) => {
    if (!value) return 0;
    const normalized = value.toString().replace(/\./g, "").replace(",", ".");
    return Number(normalized);
};
