import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Para testeo: siempre autenticado y con cooperativa dummy
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [cooperativa, setCooperativa] = useState({
    id: 1,
    nombre: "Cooperativa de Testeo",
    cuit: "12345678901",
  });

  useEffect(() => {
    // Para producción o cuando esté listo el backend, descomenta y utiliza la verificación real
    /*
    const checkSession = async () => {
      try {
        const response = await axios.get("URL_DEL_BACKEND/estado-sesion", {
          withCredentials: true,
        });
        if (response.status === 200 && response.data) {
          setIsAuthenticated(true);
          setCooperativa(response.data);
        } else {
          setIsAuthenticated(false);
          setCooperativa(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setCooperativa(null);
      }
    };
    checkSession();
    */
  }, []);

  const logout = async () => {
    try {
      await axios.post("URL_DEL_BACKEND/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
    setIsAuthenticated(false);
    setCooperativa(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, cooperativa, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
