// demandUtils.js

// Función que retorna las demandas por defecto con valores "0"
export const getDefaultDemandas = () => ({
    residencial: { facturacion: "0", tasaFiscalizacion: "0", totalPercibido: "0", totalTransferido: "0", observaciones: "" },
    comercial: { facturacion: "0", tasaFiscalizacion: "0", totalPercibido: "0", totalTransferido: "0", observaciones: "" },
    industrial: { facturacion: "0", tasaFiscalizacion: "0", totalPercibido: "0", totalTransferido: "0", observaciones: "" },
    grandesUsuarios: { facturacion: "0", tasaFiscalizacion: "0", totalPercibido: "0", totalTransferido: "0", observaciones: "" },
    contratos: { facturacion: "0", tasaFiscalizacion: "0", totalPercibido: "0", totalTransferido: "0", observaciones: "" },
    otros: { facturacion: "0", tasaFiscalizacion: "0", totalPercibido: "0", totalTransferido: "0", observaciones: "" },
});

// Función que fusiona los datos recibidos con los valores por defecto
export const mergeDemandas = (data) => {
    const defaults = getDefaultDemandas();
    if (!data) return defaults;
    Object.keys(defaults).forEach((key) => {
        defaults[key] = {
            facturacion: (data[key]?.facturacion !== undefined && data[key]?.facturacion !== null)
                ? data[key].facturacion.toString()
                : "0",
            tasaFiscalizacion: (data[key]?.tasaFiscalizacion !== undefined && data[key]?.tasaFiscalizacion !== null)
                ? data[key].tasaFiscalizacion.toString()
                : "0",
            totalPercibido: (data[key]?.totalPercibido !== undefined && data[key]?.totalPercibido !== null)
                ? data[key].totalPercibido.toString()
                : "0",
            totalTransferido: (data[key]?.totalTransferido !== undefined && data[key]?.totalTransferido !== null)
                ? data[key].totalTransferido.toString()
                : "0",
            observaciones: data[key]?.observaciones || "",
        };
    });
    return defaults;
};

// Función que prepara el objeto payload para las demandas
export const transformDemandasPayload = (demandas) => {
    // Se obtienen los valores por defecto para asegurar que no falte ninguna categoría
    const defaultDemandas = getDefaultDemandas();
    const mergedDemandas = {};
    Object.keys(defaultDemandas).forEach((key) => {
        mergedDemandas[key] = {
            facturacion: demandas[key]?.facturacion || defaultDemandas[key].facturacion,
            tasaFiscalizacion: demandas[key]?.tasaFiscalizacion || defaultDemandas[key].tasaFiscalizacion,
            totalPercibido: demandas[key]?.totalPercibido || defaultDemandas[key].totalPercibido,
            totalTransferido: demandas[key]?.totalTransferido || defaultDemandas[key].totalTransferido,
            observaciones: demandas[key]?.observaciones || defaultDemandas[key].observaciones,
        };
    });

    // Se prepara el objeto final con los valores numéricos parseados
    const payload = {};
    Object.keys(mergedDemandas).forEach((categoria) => {
        payload[categoria] = {
            facturacion: parseFloat(mergedDemandas[categoria].facturacion) || 0.0,
            total_tasa_fiscalizacion: parseFloat(mergedDemandas[categoria].tasaFiscalizacion) || 0.0,
            total_percibido: parseFloat(mergedDemandas[categoria].totalPercibido) || 0.0,
            total_transferido: parseFloat(mergedDemandas[categoria].totalTransferido) || 0.0,
            observaciones: mergedDemandas[categoria].observaciones || "",
        };
    });
    return payload;
};
