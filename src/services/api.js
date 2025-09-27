/**
 * Archivo de compatibilidad hacia atrás - API Unificada
 * Este archivo mantiene la compatibilidad con código existente
 * pero ahora utiliza la nueva estructura modular de servicios
 */

// Importar configuración base
import api from './config.js';

// Importar todos los servicios
export {
  getApiInfo,
  getHealthStatus,
} from './systemService.js';

export {
  uploadDocuments,
  workflowDocuments,
  getDocumentTypes,
  getDocument,
  downloadDocument,
} from './documentService.js';

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectDocuments,
  getProjectResults,
} from './projectService.js';

export {
  processDocuments,
  chatWithDocuments,
  testAI,
  getAIInfo,
  generateAnalysis,
  getAvailableModels,
} from './aiService.js';

// Exportar la instancia de axios por defecto para compatibilidad
export default api;