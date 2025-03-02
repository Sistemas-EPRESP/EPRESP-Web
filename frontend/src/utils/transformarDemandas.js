export const transformarDemandas = (demandasArray) => {
    if (!Array.isArray(demandasArray)) {
        return demandasArray || {};
    }

    return demandasArray.reduce((acc, item) => {
        acc[item.tipo] = {
            facturacion: item.facturacion || 0.0,
            tasaFiscalizacion: item.total_tasa_fiscalizacion || 0.0,
            totalPercibido: item.total_percibido || 0.0,
            totalTransferido: item.total_transferido || 0.0,
            observaciones: item.observaciones || "",
            id: item.id,
        };
        return acc;
    }, {});
};
