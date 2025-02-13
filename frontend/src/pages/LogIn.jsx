import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LogIn = () => {
  const [cuit, setCuit] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.0.151:3000/api/auth/login",
        { cuit, password },
        { withCredentials: true } // Asegura que las cookies se envíen y reciban
      );
      if (response.status === 200) {
        navigate("/formulario/formulario_rendicion");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (error) {
      setError("Error al iniciar sesión");
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
