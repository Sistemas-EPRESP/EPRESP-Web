// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/AxiosConfig";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cooperativa, setCooperativa] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  // Define las rutas públicas en las que no necesitas verificar la sesión
  const publicRoutes = ["/", "/login"];

  useEffect(() => {
    let isMounted = true;

    // Si la ruta actual es pública, omite el checkSession
    if (publicRoutes.includes(location.pathname)) {
      if (isMounted) setLoading(false);
      return;
    }

    // Si ya estás autenticado, no es necesario llamar a checkSession
    if (isAuthenticated) {
      if (isMounted) setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
        const response = await axios.post("/auth/refresh");
        if (isMounted) {
          if (response.status === 200 && response.data) {
            setIsAuthenticated(true);
            setCooperativa(response.data);
          } else {
            setIsAuthenticated(false);
            setCooperativa(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          // Aquí, si refresh falla, se considera que no hay sesión válida
          setIsAuthenticated(false);
          setCooperativa(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, isAuthenticated]);

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
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {});
    } catch (error) {
      // Manejo del error si es necesario
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
