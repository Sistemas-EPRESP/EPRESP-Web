/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const RendicionesContext = createContext();

export const RendicionesProvider = ({ children }) => {
  const [rendiciones, setRendiciones] = useState([]);

  return <RendicionesContext.Provider value={{ rendiciones, setRendiciones }}>{children}</RendicionesContext.Provider>;
};

export const useRendiciones = () => useContext(RendicionesContext);
