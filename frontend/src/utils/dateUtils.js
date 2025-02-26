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
