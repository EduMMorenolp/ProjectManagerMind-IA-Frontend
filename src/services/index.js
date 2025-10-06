/**
 * Índice principal de servicios de API
 * Exporta todos los servicios organizados por categoría
 */

// Configuración base
export { default as api } from './config.js';

// Servicios por categoría
export * as systemService from './systemService.js';
export * as documentService from './documentService.js';
export * as projectService from './projectService.js';
export * as aiService from './aiService.js';
export * as workflowService from './workflowService.js';

// Exportaciones individuales para compatibilidad hacia atrás
export { 
  getApiInfo, 
  getHealthStatus 
} from './systemService.js';

export { 
  uploadDocuments, 
  workflowDocuments, 
  getDocumentTypes, 
  getDocument, 
  downloadDocument 
} from './documentService.js';

export { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject, 
  getProjectDocuments, 
  getProjectResults 
} from './projectService.js';

export { 
  processDocuments, 
  chatWithDocuments, 
  testAI, 
  getAIInfo, 
  generateAnalysis, 
  getAvailableModels,
  generateHistoriasUsuario
} from './aiService.js';

// Objeto con todos los servicios agrupados (alternativa de importación)
export const services = {
  system: {
    getApiInfo: () => import('./systemService.js').then(m => m.getApiInfo),
    getHealthStatus: () => import('./systemService.js').then(m => m.getHealthStatus),
  },
  documents: {
    upload: () => import('./documentService.js').then(m => m.uploadDocuments),
    workflow: () => import('./documentService.js').then(m => m.workflowDocuments),
    getTypes: () => import('./documentService.js').then(m => m.getDocumentTypes),
    get: () => import('./documentService.js').then(m => m.getDocument),
    download: () => import('./documentService.js').then(m => m.downloadDocument),
  },
  projects: {
    getAll: () => import('./projectService.js').then(m => m.getProjects),
    getById: () => import('./projectService.js').then(m => m.getProjectById),
    create: () => import('./projectService.js').then(m => m.createProject),
    update: () => import('./projectService.js').then(m => m.updateProject),
    delete: () => import('./projectService.js').then(m => m.deleteProject),
    getDocuments: () => import('./projectService.js').then(m => m.getProjectDocuments),
    getResults: () => import('./projectService.js').then(m => m.getProjectResults),
  },
  ai: {
    process: () => import('./aiService.js').then(m => m.processDocuments),
    chat: () => import('./aiService.js').then(m => m.chatWithDocuments),
    test: () => import('./aiService.js').then(m => m.testAI),
    getInfo: () => import('./aiService.js').then(m => m.getAIInfo),
    analyze: () => import('./aiService.js').then(m => m.generateAnalysis),
    getModels: () => import('./aiService.js').then(m => m.getAvailableModels),
    generateHistoriasUsuario: () => import('./aiService.js').then(m => m.generateHistoriasUsuario),
  },
};