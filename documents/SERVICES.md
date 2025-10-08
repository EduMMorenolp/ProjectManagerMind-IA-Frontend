# Servicios del Frontend

## 🔧 Arquitectura de Servicios

El sistema de servicios de ProjectManagerMind IA está diseñado con una arquitectura dual que permite **operación transparente** entre el backend real y un sistema mock completo para desarrollo y testing.

## 🎯 Principios de Diseño

### 1. **Abstracción Transparente**
Los servicios detectan automáticamente el modo de operación y enrutan las llamadas al backend real o al sistema mock sin cambios en los componentes.

### 2. **Interface Consistente**
Todos los servicios mantienen la misma API independientemente del modo de operación.

### 3. **Fallback Inteligente**
En caso de fallo del backend, el sistema puede fallar de forma elegante al modo mock.

## 📊 Mapa de Servicios

```
Services Layer
├── Production Services (API calls)
│   ├── projectService.js
│   ├── documentService.js
│   ├── aiService.js
│   ├── systemService.js
│   └── workflowService.js
├── Mock Services (Local simulation)
│   ├── mockProjectService.js
│   ├── mockDocumentService.js
│   └── mockAIService.js
├── Configuration
│   └── config.js (Axios setup)
└── Utilities
    └── index.js (Barrel exports)
```

## 🏭 Servicios Principales

### `projectService.js` - Gestión de Proyectos

**Propósito:** Manejo completo del ciclo de vida de proyectos.

#### Métodos Principales

```javascript
// Obtener todos los proyectos
export const getProjects = async () => {
  if (isTestMode()) {
    return await mockProjectService.getProjects();
  }
  
  const response = await api.get('/api/v1/projects');
  return response.data;
};

// Crear nuevo proyecto
export const createProject = async (projectData) => {
  if (isTestMode()) {
    return await mockProjectService.createProject(projectData);
  }
  
  const response = await api.post('/api/v1/projects', projectData);
  return response.data;
};

// Obtener proyecto por ID
export const getProjectById = async (projectId) => {
  if (isTestMode()) {
    return await mockProjectService.getProjectById(projectId);
  }
  
  const response = await api.get(`/api/v1/projects/${projectId}`);
  return response.data;
};

// Actualizar proyecto
export const updateProject = async (projectId, projectData) => {
  if (isTestMode()) {
    return await mockProjectService.updateProject(projectId, projectData);
  }
  
  const response = await api.put(`/api/v1/projects/${projectId}`, projectData);
  return response.data;
};

// Eliminar proyecto
export const deleteProject = async (projectId) => {
  if (isTestMode()) {
    return await mockProjectService.deleteProject(projectId);
  }
  
  const response = await api.delete(`/api/v1/projects/${projectId}`);
  return response.data;
};

// Obtener documentos del proyecto
export const getProjectDocuments = async (projectId, filters = {}) => {
  if (isTestMode()) {
    return await mockProjectService.getProjectDocuments(projectId, filters);
  }
  
  const response = await api.get(`/api/v1/projects/${projectId}/documents`, {
    params: filters
  });
  return response.data;
};
```

#### Detección de Modo Test

```javascript
const isTestMode = () => {
  const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
  return config.provider === AI_PROVIDERS.TEST.id;
};
```

#### Estructura de Respuesta Consistente

```javascript
// Respuesta estándar de todos los métodos
{
  success: boolean,
  data: any,                    // Datos específicos del método
  message?: string,             // Mensaje opcional
  error?: string,               // Error si ocurrió
  count?: number               // Contador para listas
}
```

### `documentService.js` - Gestión de Documentos

**Propósito:** Manejo de documentos y archivos del proyecto.

#### Funcionalidades Principales

```javascript
// Subir documentos con FormData
export const uploadDocuments = async (formData) => {
  if (isTestMode()) {
    // Extraer datos del FormData para el mock
    const projectId = formData.get('projectId');
    const stage = formData.get('stage') || 'PRELIMINAR';
    const type = formData.get('type') || 'CLIENTE';
    
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
};

// Obtener documento por ID
export const getDocumentById = async (documentId) => {
  if (isTestMode()) {
    return await mockDocumentService.getDocumentById(documentId);
  }
  
  const response = await api.get(`/api/v1/documents/${documentId}`);
  return response.data;
};

// Eliminar documento
export const deleteDocument = async (documentId) => {
  if (isTestMode()) {
    return await mockDocumentService.deleteDocument(documentId);
  }
  
  const response = await api.delete(`/api/v1/documents/${documentId}`);
  return response.data;
};

// Descargar documento
export const downloadDocument = async (documentId) => {
  if (isTestMode()) {
    return await mockDocumentService.downloadDocument(documentId);
  }
  
  const response = await api.get(`/api/v1/documents/${documentId}/download`, {
    responseType: 'blob'
  });
  return response.data;
};
```

#### Validaciones de Archivos

```javascript
// Constants para validación
const ALLOWED_MIME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Validación en cliente
const validateFile = (file) => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Solo PDF y DOCX.');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Archivo demasiado grande. Máximo 10MB.');
  }
  
  return true;
};
```

### `aiService.js` - Servicios de Inteligencia Artificial

**Propósito:** Integración con múltiples proveedores de IA y sistema mock.

#### Proveedores Soportados

```javascript
const AI_PROVIDERS = {
  GEMINI: {
    id: 'gemini',
    name: 'Google Gemini Pro',
    description: 'Modelo avanzado de Google para análisis de documentos',
    available: true
  },
  OPENAI: {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Modelo de OpenAI para procesamiento de lenguaje natural',
    available: true
  },
  TEST: {
    id: 'test',
    name: 'Test IA (Mock)',
    description: 'Simulador completo para desarrollo y testing',
    available: true
  }
};
```

#### Métodos de IA

```javascript
// Procesar documentos con IA
export const processDocuments = async (data) => {
  if (isTestMode()) {
    return await mockAIService.processDocuments(data);
  }

  const response = await api.post('/api/v1/ai/process', data);
  return response.data;
};

// Chat con documentos
export const chatWithDocuments = async (chatData) => {
  if (isTestMode()) {
    return await mockAIService.chatWithDocuments(chatData);
  }

  const response = await api.post('/api/v1/ai/chat', chatData);
  return response.data;
};

// Generar diferentes tipos de estudios
export const generateRelevamiento = async (projectId, clientInfo, relevamientoInfo) => {
  if (isTestMode()) {
    return await mockAIService.generateRelevamiento(projectId, clientInfo, relevamientoInfo);
  }

  const response = await api.post('/api/v1/ai/generate-relevamiento', {
    projectId, clientInfo, relevamientoInfo
  });
  return response.data;
};

export const generateInformeEjecutivo = async (projectId, clientInfo, relevamientoInfo, configuracion) => {
  if (isTestMode()) {
    return await mockAIService.generateInformeEjecutivo(projectId, clientInfo, relevamientoInfo, configuracion);
  }

  const response = await api.post('/api/v1/ai/generate-informe', {
    projectId, clientInfo, relevamientoInfo, configuracion
  });
  return response.data;
};

export const generateHistoriasUsuario = async (projectId, configuracion) => {
  if (isTestMode()) {
    return await mockAIService.generateHistoriasUsuario(projectId, configuracion);
  }

  const response = await api.post('/api/v1/ai/generate-historias', {
    projectId, configuracion
  });
  return response.data;
};

// Obtener información del proveedor de IA
export const getAIInfo = async () => {
  if (isTestMode()) {
    return {
      success: true,
      data: {
        provider: 'Test IA (Mock)',
        model: 'mock-gemini-pro',
        status: 'active',
        version: '1.0.0-test',
        capabilities: [
          'document_analysis',
          'text_extraction', 
          'content_generation',
          'mock_processing'
        ],
        limits: {
          maxTokens: 100000,
          maxFileSize: '10MB',
          supportedFormats: ['pdf', 'docx', 'txt']
        }
      }
    };
  }

  const response = await api.get('/api/v1/ai/info');
  return response.data;
};
```

#### Información del Cliente

```javascript
// Guardar información del cliente
export const saveClientInfo = async (projectId, clientInfo) => {
  if (isTestMode()) {
    const projects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
    const projectIndex = projects.findIndex(p => p.id === projectId.toString());
    
    if (projectIndex !== -1) {
      projects[projectIndex].clientInfo = {
        ...projects[projectIndex].clientInfo,
        ...clientInfo,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('mockProjects', JSON.stringify(projects));
    }
    
    return {
      success: true,
      data: { projectId, clientInfo }
    };
  }

  const response = await api.post(`/api/v1/ai/projects/${projectId}/client-info`, clientInfo);
  return response.data;
};

// Extraer información del cliente automáticamente
export const extractClientInfo = async (projectId) => {
  if (isTestMode()) {
    // Simulación de extracción con datos realistas
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: {
        companyName: 'TechCorp Solutions SRL',
        sector: 'Tecnología y Software',
        size: 'Mediana empresa (50-200 empleados)',
        contactPerson: 'Ana García',
        email: 'ana.garcia@techcorp.com',
        phone: '+54 11 4567-8900',
        description: 'Empresa líder en desarrollo de soluciones tecnológicas',
        requirements: [
          'Sistema de gestión integral',
          'Módulo de reportes avanzados',
          'Integración con APIs externas',
          'Dashboard ejecutivo en tiempo real'
        ]
      }
    };
  }

  const response = await api.post(`/api/v1/ai/projects/${projectId}/extract-client-info`);
  return response.data;
};
```

### `workflowService.js` - Flujos de Trabajo

**Propósito:** Gestión de flujos de trabajo automatizados.

```javascript
// Flujo completo: subir y procesar documentos
export const uploadAndProcessDocuments = async (formData) => {
  try {
    // 1. Subir documentos
    const uploadResult = await documentService.uploadDocuments(formData);
    
    if (!uploadResult.success) {
      throw new Error('Error en la subida de documentos');
    }
    
    // 2. Procesar con IA
    const documents = uploadResult.data;
    const processPromises = documents.map(doc => 
      aiService.processDocuments({
        documentId: doc.id,
        projectId: doc.projectId,
        documentType: doc.type
      })
    );
    
    const processResults = await Promise.all(processPromises);
    
    return {
      success: true,
      data: {
        uploadedDocuments: documents,
        processedResults: processResults
      }
    };
  } catch (error) {
    console.error('Error en flujo de trabajo:', error);
    throw error;
  }
};

// Flujo de generación completa de estudio
export const generateCompleteStudy = async (projectId, studyType, configuration) => {
  try {
    // 1. Obtener información del cliente
    const clientInfo = await aiService.loadClientInfo(projectId);
    
    // 2. Generar estudio según el tipo
    let studyResult;
    switch (studyType) {
      case 'RELEVAMIENTO':
        studyResult = await aiService.generateRelevamiento(projectId, clientInfo.data, configuration);
        break;
      case 'INFORME_EJECUTIVO':
        studyResult = await aiService.generateInformeEjecutivo(projectId, clientInfo.data, null, configuration);
        break;
      case 'HISTORIAS_USUARIO':
        studyResult = await aiService.generateHistoriasUsuario(projectId, configuration);
        break;
      default:
        throw new Error(`Tipo de estudio no soportado: ${studyType}`);
    }
    
    return studyResult;
  } catch (error) {
    console.error('Error en generación de estudio:', error);
    throw error;
  }
};
```

## 🎭 Sistema Mock Completo

### `mockProjectService.js` - Proyectos Mock

**Propósito:** Simulación completa de gestión de proyectos con persistencia local.

#### Características del Mock

```javascript
class MockProjectService {
  constructor() {
    this.projectCounter = this.getNextId('mockProjectCounter');
    this.documentCounter = this.getNextId('mockDocumentCounter');
  }

  // Persistencia en localStorage
  getAllProjects() {
    return JSON.parse(localStorage.getItem('mockProjects') || '[]');
  }

  saveProjects(projects) {
    localStorage.setItem('mockProjects', JSON.stringify(projects));
  }

  // Simulación de delay de red
  async simulateDelay(min = 500, max = 1500) {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Generación de datos realistas
  generateMockProject(name) {
    const id = this.projectCounter++;
    const now = new Date().toISOString();

    return {
      id: id.toString(),
      name: name || `Proyecto Mock ${id}`,
      description: `Proyecto de desarrollo de software generado automáticamente para testing.`,
      clientName: `Cliente Mock ${id}`,
      status: 'ACTIVE',
      startDate: now,
      createdAt: now,
      updatedAt: now,
      _count: {
        documents: 0,
        processedResults: 0
      }
    };
  }
}
```

#### Métodos Mock Implementados

```javascript
// Crear proyecto con evento personalizado
async createProject(projectData) {
  await this.simulateDelay();
  const newProject = this.generateMockProject(projectData.name);
  
  if (projectData.description) {
    newProject.description = projectData.description;
  }
  
  const projects = this.getAllProjects();
  projects.push(newProject);
  this.saveProjects(projects);

  // Disparar evento para sincronización de componentes
  window.dispatchEvent(new CustomEvent('project-created', {
    detail: { project: newProject }
  }));
  
  return {
    success: true,
    data: newProject
  };
}

// Subir documentos con archivos reales
async uploadDocument(projectId, file, metadata = {}) {
  await this.simulateDelay();
  
  const newDocument = this.generateMockDocument(
    projectId, 
    file, 
    metadata.stage, 
    metadata.type
  );
  
  const documents = this.getAllDocuments();
  documents.push(newDocument);
  this.saveDocuments(documents);
  
  return {
    success: true,
    data: newDocument
  };
}
```

### `mockAIService.js` - IA Mock

**Propósito:** Simulación completa de servicios de IA con contenido realista.

#### Generación de Contenido Realista

```javascript
// Generar documento de relevamiento
generateRelevamientoDocument(projectId, projectName, clienteInfo = {}) {
  const content = `# Relevamiento Técnico - ${projectName}

## 1. Información General del Cliente

**Empresa:** ${clienteInfo.companyName || 'TechCorp Solutions SRL'}
**Sector:** ${clienteInfo.sector || 'Tecnología y Software'}
**Contacto Principal:** ${clienteInfo.contactPerson || 'Ana García'}

## 2. Objetivos del Proyecto

### 2.1 Objetivos Principales
- Digitalizar procesos manuales existentes
- Mejorar la eficiencia operativa
- Implementar sistema de reportes en tiempo real
- Integrar con sistemas legacy existentes

### 2.2 Objetivos Específicos
- Reducir tiempo de procesamiento en 40%
- Automatizar generación de reportes
- Implementar dashboard ejecutivo
- Mejorar trazabilidad de procesos

## 3. Análisis de Requisitos Funcionales

### 3.1 Módulo de Gestión de Usuarios
- **RF001:** Sistema de autenticación seguro
- **RF002:** Roles y permisos granulares
- **RF003:** Gestión de perfiles de usuario
- **RF004:** Auditoría de acciones de usuario

### 3.2 Módulo de Procesamiento de Datos
- **RF005:** Carga masiva de datos
- **RF006:** Validación automática de información
- **RF007:** Transformación de datos legacy
- **RF008:** Exportación en múltiples formatos

## 4. Requisitos No Funcionales

### 4.1 Rendimiento
- Tiempo de respuesta < 2 segundos
- Soporte para 100 usuarios concurrentes
- Disponibilidad 99.9%

### 4.2 Seguridad
- Encriptación de datos en tránsito y reposo
- Cumplimiento con normativas locales
- Backup automático diario

## 5. Arquitectura Propuesta

### 5.1 Frontend
- **Tecnología:** React 18 + TypeScript
- **UI Framework:** Material-UI
- **Estado:** Redux Toolkit

### 5.2 Backend
- **Tecnología:** Node.js + Express
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma

### 5.3 Infraestructura
- **Cloud Provider:** AWS
- **Contenedores:** Docker + Kubernetes
- **CI/CD:** GitHub Actions

## 6. Estimación de Esfuerzo

| Módulo | Estimación | Recursos |
|--------|------------|----------|
| Autenticación | 2 semanas | 1 dev |
| Gestión de Datos | 4 semanas | 2 devs |
| Reportes | 3 semanas | 1 dev + 1 designer |
| Integración | 2 semanas | 1 dev senior |

**Total Estimado:** 11 semanas con equipo de 3 desarrolladores

## 7. Riesgos Identificados

- **Alto:** Complejidad de integración con sistemas legacy
- **Medio:** Migración de datos históricos
- **Bajo:** Capacitación de usuarios finales

## 8. Próximos Pasos

1. Aprobación del relevamiento por stakeholders
2. Definición detallada de casos de uso
3. Diseño de arquitectura técnica
4. Setup del ambiente de desarrollo
5. Inicio del desarrollo en sprints

---
*Documento generado automáticamente por ProjectManagerMind IA*
*Fecha: ${new Date().toLocaleDateString()}*`;

  return {
    id: `relevamiento-${projectId}-${Date.now()}`,
    projectId: projectId.toString(),
    type: 'RELEVAMIENTO',
    title: `Relevamiento Técnico - ${projectName}`,
    content: content,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    // ... más propiedades
  };
}
```

#### Métodos de Generación Avanzados

```javascript
// Generar historias de usuario con estimaciones
async generateHistoriasUsuario(projectId, configuracion) {
  await this.simulateDelay();
  
  const historias = [
    {
      id: 'HU-001',
      titulo: 'Login de Usuario',
      descripcion: 'Como usuario quiero poder iniciar sesión para acceder al sistema',
      criteriosAceptacion: [
        'Validar credenciales contra base de datos',
        'Mostrar mensaje de error si las credenciales son incorrectas',
        'Redirigir al dashboard principal si las credenciales son correctas',
        'Implementar bloqueo después de 3 intentos fallidos'
      ],
      prioridad: 'Alta',
      estimacion: '3 puntos',
      sprint: 1,
      estado: 'BACKLOG'
    },
    // ... más historias
  ];
  
  return {
    success: true,
    data: {
      projectId,
      documentType: 'HISTORIAS_USUARIO',
      historias,
      resumen: {
        totalHistorias: historias.length,
        puntosEstimados: historias.reduce((sum, h) => sum + parseInt(h.estimacion), 0),
        prioridadAlta: historias.filter(h => h.prioridad === 'Alta').length
      }
    }
  };
}
```

## ⚙️ Configuración de Servicios

### `config.js` - Configuración de Axios

```javascript
import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request
api.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response) => {
    // Log de responses en desarrollo
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default api;
```

## 🔄 Sistema de Eventos

### Eventos Personalizados para Sincronización

```javascript
// Disparar evento cuando se crea un proyecto
window.dispatchEvent(new CustomEvent('project-created', {
  detail: { project: newProject }
}));

// Escuchar eventos en componentes
useEffect(() => {
  const handleProjectCreated = (event) => {
    const { project } = event.detail;
    console.log('📁 Proyecto creado:', project);
    // Actualizar lista de proyectos
    loadProjects();
  };
  
  window.addEventListener('project-created', handleProjectCreated);
  
  return () => {
    window.removeEventListener('project-created', handleProjectCreated);
  };
}, [loadProjects]);
```

## 📊 Monitoreo y Logging

### Sistema de Logging Estructurado

```javascript
// Logger personalizado
const logger = {
  info: (message, data) => {
    if (import.meta.env.DEV) {
      console.log(`ℹ️ ${message}`, data || '');
    }
  },
  
  success: (message, data) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${message}`, data || '');
    }
  },
  
  warning: (message, data) => {
    console.warn(`⚠️ ${message}`, data || '');
  },
  
  error: (message, error) => {
    console.error(`❌ ${message}`, error);
    
    // En producción, enviar a servicio de monitoreo
    if (import.meta.env.PROD) {
      // sendToErrorTracking(message, error);
    }
  },
  
  mock: (message, data) => {
    if (import.meta.env.DEV) {
      console.log(`🧪 ${message}`, data || '');
    }
  }
};

// Uso en servicios
export const createProject = async (projectData) => {
  try {
    logger.info('Creando proyecto:', projectData.name);
    
    if (isTestMode()) {
      logger.mock('Usando servicio mock para crear proyecto');
      return await mockProjectService.createProject(projectData);
    }
    
    const response = await api.post('/api/v1/projects', projectData);
    logger.success('Proyecto creado exitosamente:', response.data.data.name);
    
    return response.data;
  } catch (error) {
    logger.error('Error al crear proyecto:', error);
    throw error;
  }
};
```

## 🧪 Testing de Servicios

### Estrategias de Testing

#### Unit Tests para Servicios

```javascript
// tests/services/projectService.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProject, getProjects } from '../src/services/projectService';
import mockProjectService from '../src/services/mockProjectService';

// Mock del sistema de detección
vi.mock('../src/constants/aiProviders', () => ({
  AI_PROVIDERS: {
    TEST: { id: 'test' }
  }
}));

describe('projectService', () => {
  beforeEach(() => {
    // Configurar modo test
    localStorage.setItem('aiConfig', JSON.stringify({ provider: 'test' }));
  });

  it('should create project in test mode', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'Test Description'
    };

    const result = await createProject(projectData);

    expect(result.success).toBe(true);
    expect(result.data.name).toBe('Test Project');
    expect(result.data.id).toBeDefined();
  });

  it('should get projects list in test mode', async () => {
    const result = await getProjects();

    expect(result.success).toBe(true);
    expect(Array.isArray(result.projects)).toBe(true);
  });
});
```

#### Integration Tests

```javascript
// tests/integration/workflow.test.js
describe('Document Upload Workflow', () => {
  it('should upload and process documents', async () => {
    // 1. Crear proyecto
    const project = await projectService.createProject({
      name: 'Test Workflow Project'
    });

    // 2. Subir documento mock
    const formData = new FormData();
    formData.append('projectId', project.data.id);
    formData.append('stage', 'PRELIMINAR');
    formData.append('type', 'CLIENTE');
    
    const mockFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf'
    });
    formData.append('files', mockFile);

    const uploadResult = await documentService.uploadDocuments(formData);

    // 3. Verificar resultado
    expect(uploadResult.success).toBe(true);
    expect(uploadResult.data[0].filename).toBe('test.pdf');

    // 4. Procesar con IA
    const processResult = await aiService.processDocuments({
      documentId: uploadResult.data[0].id,
      projectId: project.data.id,
      documentType: 'CLIENTE'
    });

    expect(processResult.success).toBe(true);
    expect(processResult.data.content).toBeDefined();
  });
});
```

---

**Mantenido por**: Equipo de Servicios Backend/Frontend  
**Última actualización**: Octubre 2025