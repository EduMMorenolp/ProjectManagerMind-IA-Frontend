import api from './config.js';
import mockProjectService from './mockProjectService.js';
import { AI_PROVIDERS } from '../constants/aiProviders.js';

/**
 * Servicio para gestión de proyectos
 * Detecta automáticamente si está en modo Test IA y usa el servicio mock correspondiente
 */

// Función auxiliar para verificar si estamos en modo test
const isTestMode = () => {
  const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
  const testMode = config.provider === AI_PROVIDERS.TEST.id;
  console.log('🔍 Debug isTestMode:', {
    config,
    provider: config.provider,
    testId: AI_PROVIDERS.TEST.id,
    isTest: testMode
  });
  return testMode;
};

// Obtener todos los proyectos
export const getProjects = async () => {
  try {
    if (isTestMode()) {
      console.log('🧪 Obteniendo proyectos en modo test');
      return await mockProjectService.getProjects();
    }

    const response = await api.get('/api/v1/projects');
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

// Obtener proyecto por ID
export const getProjectById = async (projectId) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Obteniendo proyecto por ID en modo test:', projectId);
      return await mockProjectService.getProjectById(projectId);
    }

    const response = await api.get(`/api/v1/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    throw error;
  }
};

// Crear nuevo proyecto
export const createProject = async (projectData) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Creando proyecto en modo test:', projectData);
      return await mockProjectService.createProject(projectData);
    }

    const response = await api.post('/api/v1/projects', projectData);
    
    // Disparar evento personalizado para notificar a componentes
    window.dispatchEvent(new CustomEvent('project-created', {
      detail: { project: response.data }
    }));
    
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

// Actualizar proyecto
export const updateProject = async (projectId, projectData) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Actualizando proyecto en modo test:', projectId, projectData);
      return await mockProjectService.updateProject(projectId, projectData);
    }

    const response = await api.put(`/api/v1/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    throw error;
  }
};

// Eliminar proyecto
export const deleteProject = async (projectId) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Eliminando proyecto en modo test:', projectId);
      return await mockProjectService.deleteProject(projectId);
    }

    const response = await api.delete(`/api/v1/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    throw error;
  }
};

// Obtener documentos de un proyecto
export const getProjectDocuments = async (projectId) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Obteniendo documentos del proyecto en modo test:', projectId);
      const result = await mockProjectService.getProjectDocuments(projectId);
      return result.data; // Mantener consistencia con la API real
    }

    const response = await api.get(`/api/v1/projects/${projectId}/documents`);
    return response.data.data; // Extraer el array de documentos de la respuesta
  } catch (error) {
    console.error('Error al obtener documentos del proyecto:', error);
    throw error;
  }
};

// Obtener resultados procesados de un proyecto
export const getProjectResults = async (projectId) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Obteniendo resultados del proyecto en modo test:', projectId);
      return await mockProjectService.getProcessedResults(projectId);
    }

    const response = await api.get(`/api/v1/documents/projects/${projectId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener resultados del proyecto:', error);
    throw error;
  }
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectDocuments,
  getProjectResults,
};