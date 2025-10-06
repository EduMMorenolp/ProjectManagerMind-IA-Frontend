import api from './config.js';

/**
 * Servicio de Flujo de Trabajo
 * Gestiona todas las operaciones relacionadas con validaciones, transiciones y aprobaciones
 */
class WorkflowService {
  
  /**
   * Obtiene el dashboard completo de un proyecto
   * @param {string} projectId - ID del proyecto
   * @param {Object} filters - Filtros adicionales (fechas, etc.)
   * @returns {Promise<Object>} Datos del dashboard
   */
  async getProjectDashboard(projectId, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.stage) params.append('stage', filters.stage);

      const queryString = params.toString();
      const url = `/workflow/projects/${projectId}/dashboard${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo dashboard del proyecto:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error desconocido'
      };
    }
  }

  /**
   * Valida los prerequisitos para un documento o etapa
   * @param {string} projectId - ID del proyecto
   * @param {string} documentId - ID del documento (opcional)
   * @param {string} stage - Etapa a validar (opcional)
   * @returns {Promise<Object>} Resultado de la validación
   */
  async validatePrerequisites(projectId, documentId = null, stage = null) {
    try {
      const payload = { projectId };
      if (documentId) payload.documentId = documentId;
      if (stage) payload.stage = stage;

      const response = await api.post('/workflow/validate-prerequisites', payload);
      return response.data;
    } catch (error) {
      console.error('Error validando prerequisitos:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error validando prerequisitos'
      };
    }
  }

  /**
   * Ejecuta una transición de estado
   * @param {Object} transitionData - Datos de la transición
   * @param {string} transitionData.projectId - ID del proyecto
   * @param {string} transitionData.documentId - ID del documento
   * @param {string} transitionData.fromState - Estado origen
   * @param {string} transitionData.toState - Estado destino
   * @param {string} transitionData.userId - ID del usuario
   * @param {string} transitionData.reason - Razón de la transición
   * @returns {Promise<Object>} Resultado de la transición
   */
  async executeTransition(transitionData) {
    try {
      const response = await api.post('/workflow/execute-transition', transitionData);
      return response.data;
    } catch (error) {
      console.error('Error ejecutando transición:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error ejecutando transición'
      };
    }
  }

  /**
   * Obtiene documentos disponibles para crear en un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} Lista de documentos disponibles
   */
  async getAvailableDocuments(projectId) {
    try {
      const response = await api.get(`/workflow/projects/${projectId}/available-documents`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo documentos disponibles:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo documentos disponibles',
        data: []
      };
    }
  }

  /**
   * Obtiene el progreso de un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} Progreso del proyecto
   */
  async getProjectProgress(projectId) {
    try {
      const response = await api.get(`/workflow/projects/${projectId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo progreso del proyecto:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo progreso'
      };
    }
  }

  /**
   * Envía un documento para revisión
   * @param {Object} reviewData - Datos de la revisión
   * @param {string} reviewData.documentId - ID del documento
   * @param {string} reviewData.userId - ID del usuario revisor
   * @param {string} reviewData.dueDate - Fecha límite (opcional)
   * @param {string} reviewData.instructions - Instrucciones específicas (opcional)
   * @returns {Promise<Object>} Resultado del envío
   */
  async submitForReview(reviewData) {
    try {
      const response = await api.post('/workflow/submit-for-review', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error enviando para revisión:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error enviando para revisión'
      };
    }
  }

  /**
   * Agrega un comentario a un documento
   * @param {Object} commentData - Datos del comentario
   * @param {string} commentData.documentId - ID del documento
   * @param {string} commentData.userId - ID del usuario
   * @param {string} commentData.content - Contenido del comentario
   * @param {string} commentData.type - Tipo: 'suggestion', 'issue', 'approval', 'rejection'
   * @param {number} commentData.lineNumber - Línea específica (opcional)
   * @returns {Promise<Object>} Resultado de agregar comentario
   */
  async addComment(commentData) {
    try {
      const response = await api.post('/workflow/add-comment', commentData);
      return response.data;
    } catch (error) {
      console.error('Error agregando comentario:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error agregando comentario'
      };
    }
  }

  /**
   * Aprueba un documento
   * @param {Object} approvalData - Datos de la aprobación
   * @param {string} approvalData.documentId - ID del documento
   * @param {string} approvalData.userId - ID del usuario aprobador
   * @param {string} approvalData.comments - Comentarios de aprobación (opcional)
   * @returns {Promise<Object>} Resultado de la aprobación
   */
  async approveDocument(approvalData) {
    try {
      const response = await api.post('/workflow/approve-document', approvalData);
      return response.data;
    } catch (error) {
      console.error('Error aprobando documento:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error aprobando documento'
      };
    }
  }

  /**
   * Rechaza un documento
   * @param {Object} rejectionData - Datos del rechazo
   * @param {string} rejectionData.documentId - ID del documento
   * @param {string} rejectionData.userId - ID del usuario
   * @param {string} rejectionData.reason - Razón del rechazo
   * @param {string} rejectionData.feedback - Feedback detallado
   * @returns {Promise<Object>} Resultado del rechazo
   */
  async rejectDocument(rejectionData) {
    try {
      const response = await api.post('/workflow/reject-document', rejectionData);
      return response.data;
    } catch (error) {
      console.error('Error rechazando documento:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error rechazando documento'
      };
    }
  }

  /**
   * Obtiene comentarios de un documento
   * @param {string} documentId - ID del documento
   * @param {Object} filters - Filtros adicionales
   * @param {string} filters.type - Tipo de comentario
   * @param {string} filters.userId - ID del usuario
   * @returns {Promise<Object>} Lista de comentarios
   */
  async getDocumentComments(documentId, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.userId) params.append('userId', filters.userId);

      const queryString = params.toString();
      const url = `/workflow/documents/${documentId}/comments${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo comentarios',
        data: []
      };
    }
  }

  /**
   * Obtiene el historial de transiciones de un documento
   * @param {string} documentId - ID del documento
   * @returns {Promise<Object>} Historial de transiciones
   */
  async getTransitionHistory(documentId) {
    try {
      const response = await api.get(`/workflow/documents/${documentId}/transitions`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial de transiciones:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo historial',
        data: []
      };
    }
  }

  /**
   * Obtiene documentos pendientes de aprobación para un usuario
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>} Lista de documentos pendientes
   */
  async getPendingApprovals(userId, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.priority) params.append('priority', filters.priority);

      const queryString = params.toString();
      const url = `/workflow/pending-approvals?${queryString}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo aprobaciones pendientes:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo aprobaciones pendientes',
        data: []
      };
    }
  }

  /**
   * Obtiene alertas del proyecto
   * @param {string} projectId - ID del proyecto
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>} Lista de alertas
   */
  async getProjectAlerts(projectId, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.severity) params.append('severity', filters.severity);

      const queryString = params.toString();
      const url = `/workflow/projects/${projectId}/alerts${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo alertas del proyecto:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo alertas',
        data: []
      };
    }
  }

  /**
   * Obtiene métricas de KPI para un proyecto
   * @param {string} projectId - ID del proyecto
   * @param {Object} dateRange - Rango de fechas
   * @returns {Promise<Object>} KPIs del proyecto
   */
  async getProjectKPIs(projectId, dateRange = {}) {
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const queryString = params.toString();
      const url = `/workflow/projects/${projectId}/kpis${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo KPIs del proyecto:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo KPIs'
      };
    }
  }

  /**
   * Obtiene el timeline de un proyecto
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} Timeline del proyecto
   */
  async getProjectTimeline(projectId) {
    try {
      const response = await api.get(`/workflow/projects/${projectId}/timeline`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo timeline del proyecto:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo timeline'
      };
    }
  }

  /**
   * Busca documentos por criterios específicos
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @param {string} searchCriteria.projectId - ID del proyecto (opcional)
   * @param {string} searchCriteria.stage - Etapa (opcional)
   * @param {string} searchCriteria.status - Estado (opcional)
   * @param {string} searchCriteria.text - Texto a buscar (opcional)
   * @returns {Promise<Object>} Resultados de búsqueda
   */
  async searchDocuments(searchCriteria) {
    try {
      const response = await api.post('/workflow/search-documents', searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Error en búsqueda de documentos:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error en búsqueda',
        data: []
      };
    }
  }

  /**
   * Obtiene estadísticas generales del workflow
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>} Estadísticas del workflow
   */
  async getWorkflowStats(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.timeframe) params.append('timeframe', filters.timeframe);

      const queryString = params.toString();
      const url = `/workflow/stats${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de workflow:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo estadísticas'
      };
    }
  }

  /**
   * Fuerza una transición automática (para testing/desarrollo)
   * @param {string} projectId - ID del proyecto
   * @param {string} documentId - ID del documento
   * @returns {Promise<Object>} Resultado de la transición forzada
   */
  async forceAutoTransition(projectId, documentId) {
    try {
      const response = await api.post('/workflow/force-auto-transition', {
        projectId,
        documentId
      });
      return response.data;
    } catch (error) {
      console.error('Error forzando transición automática:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error forzando transición'
      };
    }
  }

  /**
   * Obtiene el estado de salud del workflow
   * @param {string} projectId - ID del proyecto
   * @returns {Promise<Object>} Estado de salud del workflow
   */
  async getWorkflowHealth(projectId) {
    try {
      const response = await api.get(`/workflow/projects/${projectId}/health`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo salud del workflow:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Error obteniendo salud del workflow'
      };
    }
  }
}

// Crear y exportar instancia del servicio
export const workflowService = new WorkflowService();
export default workflowService;
