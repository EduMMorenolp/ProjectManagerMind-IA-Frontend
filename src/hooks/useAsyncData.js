import { useState, useEffect } from 'react';

/**
 * Custom hook para manejar el estado de carga de datos
 * @param {Function} asyncFunction - Función asíncrona que obtiene los datos
 * @param {Array} dependencies - Array de dependencias para useEffect
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useAsyncData = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};