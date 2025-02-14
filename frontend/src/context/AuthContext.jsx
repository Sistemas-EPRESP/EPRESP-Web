import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cooperativa, setCooperativa] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica la sesión actual al montar el componente
  const checkSession = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.151:3000/api/auth/estado-sesion", // Actualiza con tu URL real
        { withCredentials: true }
      );
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Función para iniciar sesión
  const login = async (cuit, password) => {
    try {
      const response = await axios.post(
        "http://192.168.0.151:3000/api/auth/login", // Actualiza con tu URL real
        { cuit, password },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data) {
        setIsAuthenticated(true);
        // Se guarda la información del usuario, incluyendo el campo "tipo"
        setCooperativa(response.data.userData);
        return response.data.userData;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await axios.post(
        "http://192.168.0.151:3000/api/auth/logout", // Actualiza con tu URL real
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
    setIsAuthenticated(false);
    setCooperativa(null);
  };

  // Mientras se verifica la sesión, mostramos un loader global
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, cooperativa, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
