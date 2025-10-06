import api from './config.js';

/**
 * Servicio para gestión de proyectos
 */

// Obtener todos los proyectos
export const getProjects = async () => {
  try {
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
    const response = await api.post('/api/v1/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

// Actualizar proyecto
export const updateProject = async (projectId, projectData) => {
  try {
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