import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LogIn = () => {
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = await login(cuit, password);
    if (userData) {
      // Redirige según el tipo de usuario
      if (userData.tipo === "cooperativa") {
        navigate("/formulario/formulario_rendicion");
      } else if (userData.tipo === "administrador") {
        navigate("/rendicion_admin");
      }
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="cuit">CUIT:</label>
          <input
            type="number"
            id="cuit"
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default LogIn;
