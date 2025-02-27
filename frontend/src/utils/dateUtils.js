export const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const getNombreMes = (mesNumero) => {
  // Restamos 1 ya que el array comienza en índice 0
  return monthNames[mesNumero - 1] || "";
};

export const getMesAnterior = (mes) => {
  // Convertimos el mes a número en caso de que venga como string
  const mesNumero = parseInt(mes, 10);
  // Si es enero (1), el mes anterior es diciembre (12)
  return mesNumero === 1 ? 12 : mesNumero - 1;
};

export const getNombreMesAnterior = (mes) => {
  const mesAnteriorNumero = getMesAnterior(mes);
  return getNombreMes(mesAnteriorNumero);
};
