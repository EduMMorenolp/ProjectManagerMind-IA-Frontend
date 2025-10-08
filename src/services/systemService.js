import api from './config.js';

/**
 * Servicio para información general y estado del sistema
 */

// Obtener información general de la API
export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de la API:', error);
    throw error;
  }
};

// Verificar el estado de salud del servidor
export const getHealthStatus = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado de salud:', error);
    throw error;
  }
};

export default {
  getApiInfo,
  getHealthStatus,
};