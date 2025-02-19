import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Eliminar guiones del CUIT antes de enviarlo
    const cuitWithoutDashes = cuit.replace(/-/g, "");

    if (!cuitWithoutDashes || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      const userData = await login(cuitWithoutDashes, password);
      if (userData) {
        if (userData.tipo === "cooperativa") {
          navigate("/formulario/formulario_rendicion");
        } else if (userData.tipo === "administrador") {
          navigate("/rendiciones");
        }
      } else {
        setError("Credenciales inválidas. Por favor, intente nuevamente.");
      }
    } catch (err) {
      setError(
        "Ocurrió un error al iniciar sesión. Por favor, intente más tarde."
      );
    }
  };

  const formatCUIT = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 10)
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(
      10,
      11
    )}`;
  };

  const handleCUITChange = (e) => {
    const formatted = formatCUIT(e.target.value);
    setCuit(formatted);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="cuit"
            >
              CUIT
            </label>
            <input
              type="text"
              id="cuit"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              value={cuit}
              onChange={handleCUITChange}
              placeholder="XX-XXXXXXXX-X"
              maxLength={13}
            />
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              ></button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
