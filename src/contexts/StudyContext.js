import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { projectService } from '../services';

// Estados de generación
const GENERATION_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Estados de documentos
const DOCUMENT_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Estado inicial
const initialState = {
  // Información del proyecto actual
  projectId: null,
  projectName: '',
  
  // Estados de generación
  generationState: GENERATION_STATES.IDLE,
  currentlyGenerating: null,
  generationProgress: 0,
  estimatedTime: null,
  
  // Información de documentos
  clientInfo: {
    name: '',
    business: '',
    description: '',
    needs: '',
    history: ''
  },
  
  relevamientoInfo: {
    entrevistas: {
      stakeholders: [{ id: 1, nombre: '', cargo: '', area: '', contacto: '', notas: '' }],
      preguntas: [{ id: 1, categoria: 'Procesos Actuales', pregunta: '', respuesta: '' }]
    },
    cuestionarios: {
      areas: ['Operaciones', 'IT', 'RRHH', 'Finanzas'],
      preguntas: [{ id: 1, area: 'Operaciones', tipo: 'abierta', pregunta: '', respuesta: '' }]
    },
    observacion: {
      procesos: [{ id: 1, proceso: '', descripcion: '', problemas: '', oportunidades: '' }],
      sistemas: [{ id: 1, sistema: '', version: '', usuarios: '', problemas: '' }]
    },
    documentacion: {
      archivos: [{ id: 1, nombre: '', tipo: '', ubicacion: '', relevancia: '', notas: '' }],
      normativas: ''
    }
  },
  
  // Estados de documentos por tipo
  documentStates: {
    CLIENTE: DOCUMENT_STATES.NOT_STARTED,
    RELEVAMIENTO: DOCUMENT_STATES.NOT_STARTED,
    INFORME: DOCUMENT_STATES.NOT_STARTED,
    OBJETIVOS: DOCUMENT_STATES.NOT_STARTED,
    HISTORIAS_USUARIO: DOCUMENT_STATES.NOT_STARTED,
    DIAGRAMAS_FLUJO: DOCUMENT_STATES.NOT_STARTED,
    SPRINTS: DOCUMENT_STATES.NOT_STARTED,
    DER: DOCUMENT_STATES.NOT_STARTED,
    CASOS_USO: DOCUMENT_STATES.NOT_STARTED
  },
  
  // Documentos generados
  generatedDocuments: [],
  
  // Validaciones de prerequisitos
  prerequisites: {
    CLIENTE: { required: [], satisfied: true },
    RELEVAMIENTO: { required: ['CLIENTE'], satisfied: false },
    INFORME: { required: ['CLIENTE', 'RELEVAMIENTO'], satisfied: false },
    OBJETIVOS: { required: ['CLIENTE', 'RELEVAMIENTO'], satisfied: false },
    HISTORIAS_USUARIO: { required: ['CLIENTE', 'OBJETIVOS'], satisfied: false },
    DIAGRAMAS_FLUJO: { required: ['CLIENTE', 'RELEVAMIENTO'], satisfied: false },
    SPRINTS: { required: ['CLIENTE', 'HISTORIAS_USUARIO'], satisfied: false },
    DER: { required: ['CLIENTE', 'OBJETIVOS'], satisfied: false },
    CASOS_USO: { required: ['CLIENTE', 'OBJETIVOS'], satisfied: false }
  },
  
  // Notificaciones
  notifications: [],
  
  // Errores
  errors: []
};

// Reducer para manejar las acciones
function studyReducer(state, action) {
  switch (action.type) {
    case 'SET_PROJECT':
      return {
        ...state,
        projectId: action.payload.id,
        projectName: action.payload.name
      };
      
    case 'SET_CLIENT_INFO':
      return {
        ...state,
        clientInfo: { ...state.clientInfo, ...action.payload }
      };
      
    case 'SET_RELEVAMIENTO_INFO':
      return {
        ...state,
        relevamientoInfo: { ...state.relevamientoInfo, ...action.payload }
      };
      
    case 'START_GENERATION':
      return {
        ...state,
        generationState: GENERATION_STATES.GENERATING,
        currentlyGenerating: action.payload.documentType,
        generationProgress: 0,
        estimatedTime: action.payload.estimatedTime,
        documentStates: {
          ...state.documentStates,
          [action.payload.documentType]: DOCUMENT_STATES.IN_PROGRESS
        }
      };
      
    case 'UPDATE_GENERATION_PROGRESS':
      return {
        ...state,
        generationProgress: action.payload.progress,
        estimatedTime: action.payload.estimatedTime
      };
      
    case 'GENERATION_SUCCESS': {
      const newDocument = action.payload.document;
      return {
        ...state,
        generationState: GENERATION_STATES.SUCCESS,
        currentlyGenerating: null,
        generationProgress: 100,
        estimatedTime: null,
        documentStates: {
          ...state.documentStates,
          [action.payload.documentType]: DOCUMENT_STATES.COMPLETED
        },
        generatedDocuments: [...state.generatedDocuments, newDocument],
        notifications: [...state.notifications, {
          id: Date.now(),
          type: 'success',
          title: 'Documento generado',
          message: `${action.payload.documentType} generado exitosamente`,
          timestamp: new Date().toISOString()
        }]
      };
    }
      
    case 'GENERATION_ERROR':
      return {
        ...state,
        generationState: GENERATION_STATES.ERROR,
        currentlyGenerating: null,
        generationProgress: 0,
        estimatedTime: null,
        documentStates: {
          ...state.documentStates,
          [action.payload.documentType]: DOCUMENT_STATES.ERROR
        },
        errors: [...state.errors, action.payload.error],
        notifications: [...state.notifications, {
          id: Date.now(),
          type: 'error',
          title: 'Error en generación',
          message: action.payload.error.message || 'Error desconocido',
          timestamp: new Date().toISOString()
        }]
      };
      
    case 'UPDATE_DOCUMENT_STATES': {
      const updatedStates = { ...state.documentStates };
      const updatedPrerequisites = { ...state.prerequisites };
      
      // Actualizar estados basado en documentos existentes
      action.payload.documents.forEach(doc => {
        if (doc.documentType && updatedStates[doc.documentType] !== undefined) {
          updatedStates[doc.documentType] = DOCUMENT_STATES.COMPLETED;
        }
      });
      
      // Actualizar prerequisitos
      Object.keys(updatedPrerequisites).forEach(docType => {
        const required = updatedPrerequisites[docType].required;
        const satisfied = required.every(req => updatedStates[req] === DOCUMENT_STATES.COMPLETED);
        updatedPrerequisites[docType].satisfied = satisfied;
      });
      
      return {
        ...state,
        documentStates: updatedStates,
        prerequisites: updatedPrerequisites,
        generatedDocuments: action.payload.documents
      };
    }
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload,
          timestamp: new Date().toISOString()
        }]
      };
      
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.id)
      };
      
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
      
    case 'RESET_GENERATION_STATE':
      return {
        ...state,
        generationState: GENERATION_STATES.IDLE,
        currentlyGenerating: null,
        generationProgress: 0,
        estimatedTime: null
      };
      
    default:
      return state;
  }
}

// Crear el contexto
const StudyContext = createContext();

// Provider del contexto
export const StudyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studyReducer, initialState);
  
  // Función para actualizar estados de documentos
  const updateDocumentStates = useCallback(async (projectId) => {
    if (!projectId) return;
    
    try {
      const documents = await projectService.getProjectDocuments(projectId);
      dispatch({
        type: 'UPDATE_DOCUMENT_STATES',
        payload: { documents }
      });
    } catch (error) {
      console.error('Error updating document states:', error);
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'warning',
          title: 'Advertencia',
          message: 'No se pudieron cargar los estados de documentos'
        }
      });
    }
  }, []);
  
  // Función para obtener tiempo estimado
  const getEstimatedTime = useCallback((documentType) => {
    const timeEstimates = {
      CLIENTE: 2,
      RELEVAMIENTO: 5,
      INFORME: 8,
      OBJETIVOS: 4,
      HISTORIAS_USUARIO: 6,
      DIAGRAMAS_FLUJO: 7,
      SPRINTS: 5,
      DER: 6,
      CASOS_USO: 4
    };
    return timeEstimates[documentType] || 5;
  }, []);
  
  // Función para verificar si se puede generar un documento
  const canGenerate = useCallback((documentType) => {
    return state.prerequisites[documentType]?.satisfied && 
           state.generationState !== GENERATION_STATES.GENERATING;
  }, [state.prerequisites, state.generationState]);
  
  // Función para obtener documentos requeridos faltantes
  const getMissingRequirements = useCallback((documentType) => {
    const required = state.prerequisites[documentType]?.required || [];
    return required.filter(req => state.documentStates[req] !== DOCUMENT_STATES.COMPLETED);
  }, [state.prerequisites, state.documentStates]);
  
  const value = {
    // Estado
    ...state,
    
    // Acciones
    dispatch,
    
    // Funciones utilitarias
    updateDocumentStates,
    getEstimatedTime,
    canGenerate,
    getMissingRequirements,
    
    // Constantes
    GENERATION_STATES,
    DOCUMENT_STATES
  };
  
  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy debe ser usado dentro de un StudyProvider');
  }
  return context;
};

export default StudyContext;