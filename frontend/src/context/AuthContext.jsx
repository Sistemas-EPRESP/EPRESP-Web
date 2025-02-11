import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para guardar el usuario logueado (null si no hay sesión)
  const [user, setUser] = useState(null);

  // Simulamos un JSON con la información de inicio
  const testUser = { username: 'admin', password: 'admin123', name: 'Admin' };

  const login = (username, password) => {
    // Aquí comparas con los datos del "JSON"
    if (username === testUser.username && password === testUser.password) {
      setUser(testUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
