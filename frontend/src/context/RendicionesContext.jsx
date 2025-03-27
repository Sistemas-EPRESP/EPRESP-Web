/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const RendicionesContext = createContext();

export const RendicionesProvider = ({ children }) => {
  const [rendiciones, setRendiciones] = useState([]);

  useEffect(() => {
    console.log("Rendiciones en el contexto:", rendiciones);
  }, [rendiciones]);

  return <RendicionesContext.Provider value={{ rendiciones, setRendiciones }}>{children}</RendicionesContext.Provider>;
};

export const useRendiciones = () => useContext(RendicionesContext);
