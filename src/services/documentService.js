import api from './config.js';

/**
 * Servicio para gestión de documentos
 */

// Subir documentos
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

// Ejecutar flujo de trabajo completo
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

// Obtener tipos de documentos disponibles
export const getDocumentTypes = async () => {
  try {
    const response = await api.get('/api/v1/documents/types');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de documentos:', error);
    throw error;
  }
};

// Obtener documento específico por ID (de base de datos)
export const getDocument = async (projectName, documentId) => {
  try {
    // Si solo tenemos documentId, usar la nueva ruta para documentos de BD
    if (!projectName || documentId.includes('-')) { // UUID format
      const response = await api.get(`/api/v1/documents/db/${documentId}`);
      return response.data;
    }
    
    // Para documentos generados (legacy)
    const response = await api.get(`/api/v1/documents/${projectName}/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener documento:', error);
    throw error;
  }
};

// Descargar documento
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

// Editar documento
export const updateDocument = async (documentId, content) => {
  try {
    const response = await api.put(`/api/v1/documents/${documentId}`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    throw error;
  }
};

// Eliminar documento
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/api/v1/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
};

export default {
  uploadDocuments,
  workflowDocuments,
  getDocumentTypes,
  getDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
};