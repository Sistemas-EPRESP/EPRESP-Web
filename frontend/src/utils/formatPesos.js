// src/utils/formatPesos.js

/**
 * Función para formatear un número a un formato numérico argentino con 2 decimales.
 * No incluye el símbolo de moneda, ya que éste se muestra externamente.
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
