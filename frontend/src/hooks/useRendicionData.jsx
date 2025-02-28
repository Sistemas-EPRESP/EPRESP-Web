import { useState, useEffect } from "react";
import axiosInstance from "../config/AxiosConfig";

const useRendicionData = (id) => {
  const [rendicionData, setRendicionData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosInstance
      .get(`/rendiciones/obtener-rendicion/${id}`)
      .then((response) => {
        setRendicionData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.response?.data?.message || "Error al cargar los datos de la rendición.");
        setLoading(false);
      });
  }, [id]);

  return { rendicionData, loading, error };
};

export default useRendicionData;
