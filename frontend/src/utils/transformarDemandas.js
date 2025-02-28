export const transformarDemandas = (demandasArray) => {
    if (!Array.isArray(demandasArray)) {
        return demandasArray || {};
    }

    return demandasArray.reduce((acc, item) => {
        acc[item.tipo] = { // Usamos directamente el "tipo" que ya manda el backend
            facturacion: item.facturacion || "0.00",
            tasaFiscalizacion: item.total_tasa_fiscalizacion || "0.00",
            totalPercibido: item.total_percibido || "0.00",
            totalTransferido: item.total_transferido || "0.00",
            observaciones: item.observaciones || "",
            id: item.id,
        };
        return acc;
    }, {});
};
