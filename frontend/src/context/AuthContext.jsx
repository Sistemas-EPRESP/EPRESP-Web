import { createContext, useState, useEffect } from "react";
import usuariosData from "../data/usuario.json";
import cooperativasData from "../data/cooperativa.json";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cooperativa, setCooperativa] = useState(() => {
    const storedCoop = localStorage.getItem("cooperativa");
    return storedCoop ? JSON.parse(storedCoop) : null;
  });

  const login = (email, password) => {
    const foundUser = usuariosData.find(
      (u) => u.email === email && u.password === password && u.activo
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));

      if (foundUser.tipo === "cooperativa") {
        const coop = cooperativasData.find(
          (c) => c.id_usuario === foundUser.id
        );
        setCooperativa(coop);
        localStorage.setItem("cooperativa", JSON.stringify(coop));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCooperativa(null);
    localStorage.removeItem("user");
    localStorage.removeItem("cooperativa");
  };

  // Opcional: limpiar localStorage si la sesión expira o por otras razones

  return (
    <AuthContext.Provider value={{ user, cooperativa, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
