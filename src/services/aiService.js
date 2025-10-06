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

// Actualizar información del cliente
export const updateClientInfo = async (projectId, clientInfo) => {
  try {
    const response = await api.put('/api/v1/ai/update-client-info', {
      projectId,
      clientInfo
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar información del cliente:', error);
    throw error;
  }
};

// Guardar información del cliente (crear documento base)
export const saveClientInfo = async (clientInfo, projectName = null, projectId = null) => {
  try {
    const response = await api.post('/api/v1/ai/save-client-info', {
      clientInfo,
      projectName,
      projectId
    });
    return response.data;
  } catch (error) {
    console.error('Error al guardar información del cliente:', error);
    throw error;
  }
};

// Cargar información del cliente desde la base de datos
export const loadClientInfo = async (projectId) => {
  try {
    const response = await api.get(`/api/v1/ai/load-client-info/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar información del cliente:', error);
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

// Generar documento de relevamiento
export const generateRelevamiento = async (projectId, clientInfo, relevamientoInfo) => {
  try {
    const response = await api.post('/api/v1/ai/generate-relevamiento', {
      projectId,
      clientInfo,
      relevamientoInfo
    });
    return response.data;
  } catch (error) {
    console.error('Error al generar relevamiento:', error);
    throw error;
  }
};

// Generar informe ejecutivo
export const generateInformeEjecutivo = async (projectId, clientInfo, relevamientoInfo, configuracion) => {
  try {
    const response = await api.post('/api/v1/ai/generate-informe-ejecutivo', {
      projectId,
      clientInfo,
      relevamientoInfo,
      configuracion
    });
    return response.data;
  } catch (error) {
    console.error('Error al generar informe ejecutivo:', error);
    throw error;
  }
};

// Generar historias de usuario
export const generateHistoriasUsuario = async (projectId, configuracion = {}) => {
  try {
    const response = await api.post('/api/v1/ai/generate-historias-usuario', {
      projectId,
      documentIds: configuracion.documentIds || [],
      configuracion: {
        roles: configuracion.roles,
        epicas: configuracion.epicas,
        nivelDetalle: configuracion.nivelDetalle || 'intermedio',
        industry: configuracion.industry,
        objectives: configuracion.objectives,
        constraints: configuracion.constraints,
        stakeholders: configuracion.stakeholders,
        personalizada: configuracion.personalizada || {}
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al generar historias de usuario:', error);
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
  generateHistoriasUsuario,
};