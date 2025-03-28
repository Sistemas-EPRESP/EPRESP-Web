// Componente para mostrar notificaciones de éxito o error
const NotificationMessage = ({ message, type }) => {
  // Definir estilos condicionales según el tipo de mensaje
  const containerStyles = type === "error" ? "my-6 p-4 bg-red-50 rounded-md" : "my-6 p-4 bg-green-50 rounded-md";
  const textStyles = type === "error" ? "text-red-700" : "text-green-700";

  return (
    <section aria-live="polite" className={containerStyles}>
      <p className={textStyles}>{message}</p>
    </section>
  );
};

export default NotificationMessage;
