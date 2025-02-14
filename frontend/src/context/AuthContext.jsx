// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "../config/AxiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cooperativa, setCooperativa] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica la sesión actual (por ejemplo, con un endpoint de estado de sesión)
  const checkSession = async () => {
    try {
      const response = await axios.post("/auth/refresh");
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
      const response = await axios.post("/auth/login", { cuit, password });
      if (response.status === 200 && response.data) {
        setIsAuthenticated(true);
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
      await axios.post("/auth/logout", {});
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
    setIsAuthenticated(false);
    setCooperativa(null);
  };

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
