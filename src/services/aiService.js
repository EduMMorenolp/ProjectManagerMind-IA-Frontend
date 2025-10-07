import api from './config';
import MockAIService from './mockAIService';
import { AI_PROVIDERS } from '../constants/aiProviders';

// Función auxiliar para verificar si estamos en modo test
const isTestMode = () => {
  const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
  return config.selectedProvider === AI_PROVIDERS.TEST.id;
};

// Procesar documentos
export const processDocuments = async (data) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Procesando documentos en modo test:', data);
      return await MockAIService.processDocuments(data);
    }

    const response = await api.post('/api/v1/ai/process', data);
    return response.data;
  } catch (error) {
    console.error('Error al procesar documentos:', error);
    throw error;
  }
};

// Chat con documentos
export const chatWithDocuments = async (chatData) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Chat en modo test:', chatData);
      return await MockAIService.chatWithDocuments(chatData);
    }

    const response = await api.post('/api/v1/ai/chat', chatData);
    return response.data;
  } catch (error) {
    console.error('Error en chat:', error);
    throw error;
  }
};

// Generar relevamiento
export const generateRelevamiento = async (projectId, clientInfo, relevamientoInfo) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Generando relevamiento en modo test:', { projectId, clientInfo, relevamientoInfo });
      return await MockAIService.generateRelevamiento(projectId, clientInfo, relevamientoInfo);
    }

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
    if (isTestMode()) {
      console.log('🧪 Generando informe ejecutivo en modo test:', { projectId });
      return await MockAIService.generateInformeEjecutivo(projectId, clientInfo, relevamientoInfo, configuracion);
    }

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
    if (isTestMode()) {
      console.log('🧪 Generando historias de usuario en modo test:', { projectId });
      return await MockAIService.generateHistoriasUsuario(projectId, configuracion);
    }

    const response = await api.post('/api/v1/ai/generate-historias-usuario', {
      projectId,
      configuracion
    });
    return response.data;
  } catch (error) {
    console.error('Error al generar historias de usuario:', error);
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
    const response = await api.put(`/api/v1/ai/client-info/${projectId}`, clientInfo);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar información del cliente:', error);
    throw error;
  }
};

// Guardar información del cliente
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

// Cargar información del cliente
export const loadClientInfo = async (projectId) => {
  try {
    const response = await api.get(`/api/v1/ai/client-info/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error al cargar información del cliente:', error);
    throw error;
  }
};

// Generar diagramas de flujo
export const generateDiagramasFlujo = async (projectId, configuracion = {}) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Generando diagramas de flujo en modo test:', { projectId });
      return await MockAIService.generateDiagramasFlujo(projectId, configuracion);
    }

    const response = await api.post('/api/v1/ai/generate-diagramas-flujo', {
      projectId,
      configuracion
    });
    return response.data;
  } catch (error) {
    console.error('Error al generar diagramas de flujo:', error);
    throw error;
  }
};

// Generar planificación de sprints
export const generateSprintPlanning = async (projectId, configuracion = {}) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Generando planificación de sprints en modo test:', { projectId });
      return await MockAIService.generateSprintPlanning(projectId, configuracion);
    }

    const response = await api.post('/api/v1/ai/generate-sprint-planning', {
      projectId,
      configuracion
    });
    return response.data;
  } catch (error) {
    console.error('Error al generar planificación de sprints:', error);
    throw error;
  }
};

// Exportar planificación de sprints
export const exportSprintPlanning = async (planificacionId, formato = 'json', configuracion = {}) => {
  try {
    const response = await api.post('/api/v1/ai/export-sprint-planning', {
      planificacionId,
      formato,
      configuracion
    });

    // Si el formato es archivo, manejar descarga
    if (['pdf', 'excel', 'json'].includes(formato.toLowerCase())) {
      const blob = new Blob([response.data], {
        type: formato === 'pdf' ? 'application/pdf' : 
              formato === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              'application/json'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sprint-planning-${planificacionId}.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    return response.data;
  } catch (error) {
    console.error('Error al exportar planificación de sprints:', error);
    throw error;
  }
};

// Generar DER (Diagrama Entidad-Relación)
export const generateDER = async (derConfig) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Generando DER en modo test:', derConfig);
      return await MockAIService.generateDER(derConfig);
    }

    const response = await api.post('/api/v1/ai/generate-der', derConfig);
    return response.data;
  } catch (error) {
    console.error('Error al generar DER:', error);
    throw error;
  }
};

// Exportar DER
export const exportDER = async (exportConfig) => {
  try {
    const response = await api.post('/api/v1/ai/export-der', exportConfig);
    return response.data;
  } catch (error) {
    console.error('Error al exportar DER:', error);
    throw error;
  }
};

// Validar DER
export const validateDER = async (validationConfig) => {
  try {
    const response = await api.post('/api/v1/ai/validate-der', validationConfig);
    return response.data;
  } catch (error) {
    console.error('Error al validar DER:', error);
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

// Generar análisis
export const generateAnalysis = async (analysisData) => {
  try {
    const response = await api.post('/api/v1/ai/generate-analysis', analysisData);
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

// Exportar por defecto
export default {
  processDocuments,
  chatWithDocuments,
  generateRelevamiento,
  generateInformeEjecutivo,
  generateHistoriasUsuario,
  generateDiagramasFlujo,
  generateSprintPlanning,
  exportSprintPlanning,
  generateDER,
  exportDER,
  validateDER,
  extractClientInfo,
  updateClientInfo,
  saveClientInfo,
  loadClientInfo,
  getAIInfo,
  generateAnalysis,
  getAvailableModels,
  testAI
};