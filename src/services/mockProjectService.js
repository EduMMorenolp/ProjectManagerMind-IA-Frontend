/**
 * Servicio Mock para gestión de proyectos
 * Simula un backend completo en el frontend para testing
 */

import { MOCK_SPEEDS } from '../constants/aiProviders.js';

class MockProjectService {
  constructor() {
    this.storageKey = 'mockProjects';
    this.documentStorageKey = 'mockDocuments';
    this.processedResultsKey = 'mockProcessedResults';
    this.projectCounter = this.getLastProjectId() + 1;
    this.documentCounter = this.getLastDocumentId() + 1;
    this.resultCounter = this.getLastResultId() + 1;
  }

  // Helpers para obtener últimos IDs
  getLastProjectId() {
    const projects = this.getAllProjects();
    return projects.length > 0 ? Math.max(...projects.map(p => parseInt(p.id))) : 0;
  }

  getLastDocumentId() {
    const documents = this.getAllDocuments();
    return documents.length > 0 ? Math.max(...documents.map(d => parseInt(d.id))) : 0;
  }

  getLastResultId() {
    const results = this.getAllProcessedResults();
    return results.length > 0 ? Math.max(...results.map(r => parseInt(r.id))) : 0;
  }

  // Simular delay de procesamiento
  async simulateDelay() {
    const config = this.getMockConfig();
    const delayConfig = MOCK_SPEEDS[config.speed] || MOCK_SPEEDS.normal;
    const delay = Math.random() * (delayConfig.max - delayConfig.min) + delayConfig.min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Obtener configuración mock
  getMockConfig() {
    const aiConfig = JSON.parse(localStorage.getItem('aiConfig') || '{}');
    return aiConfig.mockConfig || { speed: 'normal', simulateErrors: false };
  }

  // Métodos de almacenamiento
  getAllProjects() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveProjects(projects) {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  getAllDocuments() {
    return JSON.parse(localStorage.getItem(this.documentStorageKey) || '[]');
  }

  saveDocuments(documents) {
    localStorage.setItem(this.documentStorageKey, JSON.stringify(documents));
  }

  getAllProcessedResults() {
    return JSON.parse(localStorage.getItem(this.processedResultsKey) || '[]');
  }

  saveProcessedResults(results) {
    localStorage.setItem(this.processedResultsKey, JSON.stringify(results));
  }

  // Generar datos mock
  generateMockProject(name) {
    const id = this.projectCounter++;
    const now = new Date().toISOString();
    
    return {
      id: id.toString(),
      name: name || `Proyecto Mock ${id}`,
      description: `Proyecto de prueba generado automáticamente el ${new Date().toLocaleDateString()}`,
      clientName: `Cliente Mock ${id}`,
      startDate: now,
      endDate: null,
      status: 'ACTIVE',
      stage: 'PRELIMINAR',
      createdAt: now,
      updatedAt: now,
      _count: { documents: 0, processedResults: 0 }
    };
  }

  generateMockDocument(projectId, file, stage = 'PRELIMINAR', type = 'CLIENTE') {
    const id = this.documentCounter++;
    const now = new Date().toISOString();

    return {
      id: id.toString(),
      projectId: projectId.toString(),
      filename: file.name,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      stage: stage,
      type: type,
      status: 'UPLOADED',
      uploadedAt: now,
      createdAt: now,
      updatedAt: now,
      // Simular contenido extraído
      extractedText: `Contenido simulado extraído del archivo ${file.name}. 
Este es un texto de prueba que simula el contenido real del documento.
Incluye información relevante para el proyecto de desarrollo de software.`,
      metadata: {
        pages: Math.floor(Math.random() * 20) + 1,
        words: Math.floor(Math.random() * 1000) + 100,
        characters: Math.floor(Math.random() * 5000) + 500
      }
    };
  }

  // API Methods - Projects
  async getProjects() {
    await this.simulateDelay();
    const projects = this.getAllProjects();
    
    // Calcular conteos para cada proyecto
    const documents = this.getAllDocuments();
    const results = this.getAllProcessedResults();
    
    const projectsWithCounts = projects.map(project => ({
      ...project,
      _count: {
        documents: documents.filter(d => d.projectId === project.id).length,
        processedResults: results.filter(r => r.projectId === project.id).length
      }
    }));

    return {
      success: true,
      count: projectsWithCounts.length,
      projects: projectsWithCounts
    };
  }

  async getProjectById(projectId) {
    await this.simulateDelay();
    const projects = this.getAllProjects();
    const project = projects.find(p => p.id === projectId.toString());
    
    if (!project) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    // Agregar documentos y resultados relacionados
    const documents = this.getAllDocuments().filter(d => d.projectId === projectId.toString());
    const processedResults = this.getAllProcessedResults().filter(r => r.projectId === projectId.toString());

    return {
      success: true,
      data: {
        ...project,
        documents,
        processedResults,
        _count: {
          documents: documents.length,
          processedResults: processedResults.length
        }
      }
    };
  }

  async createProject(projectData) {
    await this.simulateDelay();
    const newProject = this.generateMockProject(projectData.name);
    
    if (projectData.description) {
      newProject.description = projectData.description;
    }
    
    const projects = this.getAllProjects();
    projects.push(newProject);
    this.saveProjects(projects);

    console.log('🧪 Proyecto mock creado:', newProject);
    
    // Disparar evento personalizado para notificar a componentes
    window.dispatchEvent(new CustomEvent('project-created', {
      detail: { project: newProject }
    }));
    
    return {
      success: true,
      data: newProject
    };
  }

  async updateProject(projectId, projectData) {
    await this.simulateDelay();
    const projects = this.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId.toString());
    
    if (projectIndex === -1) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveProjects(projects);

    return {
      success: true,
      data: projects[projectIndex]
    };
  }

  async deleteProject(projectId) {
    await this.simulateDelay();
    let projects = this.getAllProjects();
    const projectExists = projects.some(p => p.id === projectId.toString());
    
    if (!projectExists) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    // Eliminar proyecto
    projects = projects.filter(p => p.id !== projectId.toString());
    this.saveProjects(projects);

    // Eliminar documentos relacionados
    let documents = this.getAllDocuments();
    documents = documents.filter(d => d.projectId !== projectId.toString());
    this.saveDocuments(documents);

    // Eliminar resultados procesados relacionados
    let results = this.getAllProcessedResults();
    results = results.filter(r => r.projectId !== projectId.toString());
    this.saveProcessedResults(results);

    return {
      success: true,
      message: 'Proyecto eliminado exitosamente'
    };
  }

  // API Methods - Documents
  async getProjectDocuments(projectId, filters = {}) {
    await this.simulateDelay();
    let documents = this.getAllDocuments().filter(d => d.projectId === projectId.toString());
    
    // Aplicar filtros
    if (filters.stage) {
      documents = documents.filter(d => d.stage === filters.stage);
    }
    
    if (filters.type) {
      documents = documents.filter(d => d.type === filters.type);
    }

    return {
      success: true,
      data: documents
    };
  }

  async uploadDocument(projectId, file, metadata = {}) {
    await this.simulateDelay();
    
    // Verificar que el proyecto existe
    const projects = this.getAllProjects();
    const project = projects.find(p => p.id === projectId.toString());
    
    if (!project) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    const newDocument = this.generateMockDocument(
      projectId, 
      file, 
      metadata.stage, 
      metadata.type
    );
    
    const documents = this.getAllDocuments();
    documents.push(newDocument);
    this.saveDocuments(documents);

    console.log('🧪 Documento mock subido:', newDocument);
    
    return {
      success: true,
      data: newDocument
    };
  }

  async deleteDocument(documentId) {
    await this.simulateDelay();
    let documents = this.getAllDocuments();
    const documentExists = documents.some(d => d.id === documentId.toString());
    
    if (!documentExists) {
      throw new Error(`Documento con ID ${documentId} no encontrado`);
    }

    documents = documents.filter(d => d.id !== documentId.toString());
    this.saveDocuments(documents);

    return {
      success: true,
      message: 'Documento eliminado exitosamente'
    };
  }

  // API Methods - Processed Results
  async getProcessedResults(projectId, filters = {}) {
    await this.simulateDelay();
    let results = this.getAllProcessedResults().filter(r => r.projectId === projectId.toString());
    
    if (filters.stage) {
      results = results.filter(r => r.stage === filters.stage);
    }
    
    if (filters.type) {
      results = results.filter(r => r.type === filters.type);
    }

    return {
      success: true,
      data: results
    };
  }

  async saveProcessedResult(projectId, resultData) {
    await this.simulateDelay();
    
    const id = this.resultCounter++;
    const now = new Date().toISOString();
    
    const processedResult = {
      id: id.toString(),
      projectId: projectId.toString(),
      type: resultData.type,
      stage: resultData.stage,
      content: resultData.content,
      metadata: resultData.metadata || {},
      status: 'COMPLETED',
      createdAt: now,
      updatedAt: now
    };

    const results = this.getAllProcessedResults();
    results.push(processedResult);
    this.saveProcessedResults(results);

    console.log('🧪 Resultado procesado mock guardado:', processedResult);
    
    return {
      success: true,
      data: processedResult
    };
  }

  // Métodos de utilidad
  async clearAllMockData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.documentStorageKey);
    localStorage.removeItem(this.processedResultsKey);
    
    return {
      success: true,
      message: 'Todos los datos mock han sido eliminados'
    };
  }

  async seedMockData() {
    // Crear algunos proyectos de ejemplo
    const sampleProjects = [
      { name: 'E-commerce Platform', description: 'Desarrollo de plataforma de comercio electrónico' },
      { name: 'CRM System', description: 'Sistema de gestión de relaciones con clientes' },
      { name: 'Mobile App', description: 'Aplicación móvil para gestión de tareas' }
    ];

    for (const projectData of sampleProjects) {
      await this.createProject(projectData);
    }

    return {
      success: true,
      message: 'Datos mock de ejemplo creados'
    };
  }
}

// Singleton instance
const mockProjectService = new MockProjectService();

export default mockProjectService;