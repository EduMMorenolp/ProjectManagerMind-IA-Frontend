import api from './config.js';
import mockDocumentService from './mockDocumentService.js';
import { AI_PROVIDERS } from '../constants/aiProviders.js';

/**
 * Servicio para gestión de documentos
 * Detecta automáticamente si está en modo Test IA y usa el servicio mock correspondiente
 */

// Función auxiliar para verificar si estamos en modo test
const isTestMode = () => {
  const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
  return config.provider === AI_PROVIDERS.TEST.id;
};

// Subir documentos
export const uploadDocuments = async (formData) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Subiendo documentos en modo test');
      
      // Extraer datos del FormData para el mock
      const projectId = formData.get('projectId');
      const stage = formData.get('stage') || 'PRELIMINAR';
      const type = formData.get('type') || 'CLIENTE';
      
      // Obtener archivos del FormData
      const files = [];
      const fileInputs = formData.getAll('files');
      for (const file of fileInputs) {
        if (file instanceof File) {
          files.push(file);
        }
      }
      
      return await mockDocumentService.uploadDocuments(projectId, files, stage, type);
    }

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
    if (isTestMode()) {
      console.log('🧪 Ejecutando workflow de documentos en modo test');
      
      // Extraer datos del FormData
      const projectId = formData.get('projectId');
      const stage = formData.get('stage') || 'PRELIMINAR';
      const documentTypes = JSON.parse(formData.get('documentTypes') || '["RELEVAMIENTO"]');
      
      // Obtener archivos del FormData
      const files = [];
      const fileInputs = formData.getAll('files');
      for (const file of fileInputs) {
        if (file instanceof File) {
          files.push(file);
        }
      }
      
      return await mockDocumentService.uploadAndProcess(projectId, files, stage, documentTypes);
    }

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
    if (isTestMode()) {
      console.log('🧪 Obteniendo tipos de documentos en modo test');
      // Retornar tipos de documentos mock
      return {
        success: true,
        data: {
          stages: ['PRELIMINAR', 'ANALISIS', 'DISENO'],
          types: {
            PRELIMINAR: ['CLIENTE', 'RELEVAMIENTO'],
            ANALISIS: ['INFORME'],
            DISENO: ['OBJETIVOS']
          }
        }
      };
    }

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
    if (isTestMode()) {
      console.log('🧪 Obteniendo documento en modo test:', documentId);
      return await mockDocumentService.getDocumentById(documentId);
    }

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
    if (isTestMode()) {
      console.log('🧪 Eliminando documento en modo test:', documentId);
      return await mockDocumentService.deleteDocument(documentId);
    }

    const response = await api.delete(`/api/v1/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    throw error;
  }
};

// Obtener documentos por proyecto
export const getDocumentsByProject = async (projectId) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Obteniendo documentos por proyecto en modo test:', projectId);
      return await mockDocumentService.getProjectDocuments(projectId);
    }

    const response = await api.get(`/api/v1/projects/${projectId}/documents`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener documentos del proyecto:', error);
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
  getDocumentsByProject,
};