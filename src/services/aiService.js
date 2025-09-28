import api from './config.js';

/**
 * Servicio para funcionalidades de IA
 */

// Procesar documentos con IA
export const processDocuments = async (data) => {
  try {
    const response = await api.post('/api/v1/documents/process', data);
    return response.data;
  } catch (error) {
    console.error('Error al procesar documentos:', error);
    throw error;
  }
};

// Chat con documentos usando IA
export const chatWithDocuments = async (chatData) => {
  try {
    const response = await api.post('/api/v1/ai/chat', chatData);
    return response.data;
  } catch (error) {
    console.error('Error en chat:', error);
    throw error;
  }
};

// Probar conexión con IA
export const testAI = async () => {
  try {
    const response = await api.get('/api/v1/ai/test');
    return response.data;
  } catch (error) {
    console.error('Error al probar conexión con IA:', error);
    throw error;
  }
};

// Obtener información de IA
export const getAIInfo = async () => {
  try {
    const response = await api.get('/api/v1/ai/info');
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de IA:', error);
    throw error;
  }
};

// Extraer información del cliente desde documentos
export const extractClientInfo = async (formData) => {
  try {
    const response = await api.post('/api/v1/ai/extract-client-info', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al extraer información del cliente:', error);
    throw error;
  }
};

// Generar análisis personalizado
export const generateAnalysis = async (analysisData) => {
  try {
    const response = await api.post('/api/v1/ai/analysis', analysisData);
    return response.data;
  } catch (error) {
    console.error('Error al generar análisis:', error);
    throw error;
  }
};

// Obtener modelos disponibles
export const getAvailableModels = async () => {
  try {
    const response = await api.get('/api/v1/ai/models');
    return response.data;
  } catch (error) {
    console.error('Error al obtener modelos disponibles:', error);
    throw error;
  }
};

export default {
  processDocuments,
  chatWithDocuments,
  testAI,
  getAIInfo,
  generateAnalysis,
  getAvailableModels,
};