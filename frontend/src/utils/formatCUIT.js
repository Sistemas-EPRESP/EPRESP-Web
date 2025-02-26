/**
 * Función para formatear el CUIT.
 * Si el número tiene 11 dígitos, lo formatea como XX-XXXXXXXX-X.
 *
 * @param {number|string} cuit - Número o cadena representando el CUIT.
 * @returns {string} CUIT formateado.
 */
export const formatCUIT = (cuit) => {
    const cuitStr = cuit.toString();
    if (cuitStr.length === 11) {
        return `${cuitStr.slice(0, 2)}-${cuitStr.slice(2, 10)}-${cuitStr.slice(10)}`;
    }
    return cuitStr;
};
