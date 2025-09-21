import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio para información general
export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de la API:', error);
    throw error;
  }
};

// Servicio para verificar el estado de salud del servidor
export const getHealthStatus = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado de salud:', error);
    throw error;
  }
};

// Servicios para gestión de documentos
export const uploadDocuments = async (formData) => {
  try {
    const response = await api.post('/api/v1/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir documentos:', error);
    throw error;
  }
};

export const processDocuments = async (data) => {
  try {
    const response = await api.post('/api/v1/ai/process', data);
    return response.data;
  } catch (error) {
    console.error('Error al procesar documentos:', error);
    throw error;
  }
};

export const workflowDocuments = async (formData) => {
  try {
    const response = await api.post('/api/v1/documents/workflow', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al ejecutar flujo de trabajo:', error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const response = await api.get('/api/v1/documents/projects');
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/api/v1/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

export const chatWithDocuments = async (chatData) => {
  try {
    const response = await api.post('/api/v1/ai/chat', chatData);
    return response.data;
  } catch (error) {
    console.error('Error en chat:', error);
    throw error;
  }
};

export const getDocumentTypes = async () => {
  try {
    const response = await api.get('/api/v1/documents/types');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error);
    throw error;
  }
};

export const getDocument = async (projectName, documentId) => {
  try {
    const response = await api.get(`/api/v1/documents/${projectName}/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener documento:', error);
    throw error;
  }
};

export const downloadDocument = async (projectName, documentId, format = 'md') => {
  try {
    const response = await api.get(
      `/api/v1/documents/${projectName}/${documentId}/download?format=${format}`,
      { responseType: 'blob' }
    );
    
    // Crear URL para descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${documentId}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error al descargar documento:', error);
    throw error;
  }
};

// Servicios para IA
export const testAI = async () => {
  try {
    const response = await api.get('/api/v1/ai/test');
    return response.data;
  } catch (error) {
    console.error('Error al probar conexión con IA:', error);
    throw error;
  }
};

export const getAIInfo = async () => {
  try {
    const response = await api.get('/api/v1/ai/info');
    return response.data;
  } catch (error) {
    console.error('Error al obtener información de IA:', error);
    throw error;
  }
};

export default api;