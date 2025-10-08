# Sistema Mock Completo

## 🎭 Visión General del Sistema Mock

El **Sistema Mock de ProjectManagerMind IA** es una implementación completa que simula todas las funcionalidades del backend, permitiendo desarrollo frontend independiente, testing robusto y demos sin infraestructura.

## 🎯 Objetivos del Sistema Mock

### 1. **Desarrollo Independiente**
- Permite trabajar en el frontend sin necesidad del backend
- Acelera el ciclo de desarrollo
- Facilita el trabajo en equipo distribuido

### 2. **Testing Confiable**
- Datos consistentes y predecibles
- Sin dependencias externas
- Pruebas rápidas y repetibles

### 3. **Demos y Presentaciones**
- Funciona sin conexión a internet
- Datos realistas y convincentes
- No requiere configuración de infraestructura

### 4. **Prototipado Rápido**
- Iteración rápida de features
- Validación de UX sin backend
- Feedback inmediato de stakeholders

## 🏗️ Arquitectura del Sistema Mock

```
Mock System Architecture
├── Detection Layer
│   └── isTestMode() - Detección automática
├── Data Layer
│   ├── localStorage persistence
│   ├── Realistic data generation
│   └── Relationship management
├── Service Layer
│   ├── mockProjectService.js
│   ├── mockDocumentService.js
│   └── mockAIService.js
└── Event System
    ├── Custom events
    ├── Component synchronization
    └── State consistency
```

## 🔧 Configuración y Activación

### Activación del Modo Mock

El sistema mock se activa automáticamente cuando se selecciona **"Test IA (Mock)"** como proveedor de IA:

```javascript
// Configuración guardada en localStorage
{
  "provider": "test",
  "settings": {
    "speed": "normal",
    "dataSet": "realistic"
  }
}
```

### Detección Automática

```javascript
// Función de detección utilizada en todos los servicios
const isTestMode = () => {
  const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
  return config.provider === AI_PROVIDERS.TEST.id;
};

// Uso en servicios
export const getProjects = async () => {
  if (isTestMode()) {
    return await mockProjectService.getProjects();
  }
  
  // Llamada real al API
  const response = await api.get('/api/v1/projects');
  return response.data;
};
```

## 📊 Estructura de Datos Mock

### Persistencia en localStorage

```javascript
// Claves utilizadas en localStorage
const STORAGE_KEYS = {
  AI_CONFIG: 'aiConfig',           // Configuración del proveedor IA
  MOCK_PROJECTS: 'mockProjects',   // Proyectos mock
  MOCK_DOCUMENTS: 'mockDocuments', // Documentos mock
  MOCK_RESULTS: 'mockResults',     // Resultados procesados
  COUNTERS: {
    PROJECT: 'mockProjectCounter',  // Contador de proyectos
    DOCUMENT: 'mockDocumentCounter' // Contador de documentos
  }
};
```

### Estructura de Datos Consistente

#### Proyecto Mock
```javascript
{
  id: "1",                         // ID único autoincrementable
  name: "Sistema de Gestión CRM",  // Nombre del proyecto
  description: "Desarrollo de sistema CRM personalizado...",
  clientName: "TechCorp Solutions SRL",
  status: "ACTIVE",               // ACTIVE | COMPLETED | PAUSED
  startDate: "2025-10-07T10:00:00.000Z",
  createdAt: "2025-10-07T10:00:00.000Z",
  updatedAt: "2025-10-07T10:00:00.000Z",
  clientInfo: {                   // Información del cliente
    companyName: "TechCorp Solutions SRL",
    sector: "Tecnología y Software",
    contactPerson: "Ana García",
    email: "ana.garcia@techcorp.com",
    phone: "+54 11 4567-8900",
    requirements: ["Sistema integral", "Reportes avanzados"]
  },
  _count: {                       // Contadores relacionados
    documents: 3,
    processedResults: 2
  }
}
```

#### Documento Mock
```javascript
{
  id: "1",                        // ID único del documento
  projectId: "1",                 // Referencia al proyecto
  filename: "requirements.pdf",   // Nombre del archivo original
  originalName: "requirements.pdf",
  mimetype: "application/pdf",
  size: 2048576,                  // Tamaño en bytes
  stage: "PRELIMINAR",            // PRELIMINAR | ANALISIS | DISENO
  type: "CLIENTE",                // CLIENTE | RELEVAMIENTO | INFORME | OBJETIVOS
  status: "UPLOADED",             // UPLOADED | PROCESSING | COMPLETED | ERROR
  uploadedAt: "2025-10-07T10:30:00.000Z",
  createdAt: "2025-10-07T10:30:00.000Z",
  updatedAt: "2025-10-07T10:30:00.000Z",
  extractedText: "Contenido extraído del documento...",
  metadata: {
    pages: 15,
    words: 2500,
    characters: 15000
  }
}
```

## 🔄 Servicios Mock Implementados

### `mockProjectService.js` - Gestión de Proyectos

#### Funcionalidades Completas

```javascript
class MockProjectService {
  // Operaciones CRUD completas
  async getProjects()              // Listar proyectos con contadores
  async getProjectById(id)         // Obtener proyecto específico
  async createProject(data)        // Crear nuevo proyecto
  async updateProject(id, data)    // Actualizar proyecto existente
  async deleteProject(id)          // Eliminar proyecto
  
  // Operaciones de documentos
  async getProjectDocuments(id, filters)  // Documentos del proyecto
  async uploadDocument(projectId, file, metadata)  // Subir documento
  async deleteDocument(id)         // Eliminar documento
  
  // Generación de datos realistas
  generateMockProject(name)        // Proyecto con datos realistas
  generateMockDocument(projectId, file, stage, type)  // Documento realista
  
  // Utilidades
  simulateDelay(min, max)          // Simular latencia de red
  getNextId(counterKey)            // IDs únicos autoincrementables
}
```

#### Generación de Datos Realistas

```javascript
generateMockProject(name) {
  const companies = [
    'TechCorp Solutions SRL', 'InnovaSoft SA', 'DataSystems Ltda',
    'CloudTech Inc', 'SmartBiz Co', 'DigitalForward Ltda'
  ];
  
  const sectors = [
    'Tecnología y Software', 'Servicios Financieros', 'Retail y E-commerce',
    'Salud y Medicina', 'Educación', 'Manufactura', 'Logística'
  ];
  
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];
  const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
  
  return {
    id: this.getNextId('mockProjectCounter').toString(),
    name: name || `Sistema ${randomSector} - ${randomCompany}`,
    description: this.generateProjectDescription(randomSector),
    clientName: randomCompany,
    status: 'ACTIVE',
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clientInfo: {
      companyName: randomCompany,
      sector: randomSector,
      size: this.getRandomCompanySize(),
      contactPerson: this.getRandomContactPerson(),
      requirements: this.generateRandomRequirements()
    },
    _count: { documents: 0, processedResults: 0 }
  };
}

generateProjectDescription(sector) {
  const descriptions = {
    'Tecnología y Software': 'Desarrollo de plataforma tecnológica innovadora para optimizar procesos empresariales mediante automatización inteligente.',
    'Servicios Financieros': 'Sistema integral de gestión financiera con módulos de contabilidad, facturación y análisis de rentabilidad.',
    'Retail y E-commerce': 'Plataforma de comercio electrónico con gestión de inventario, procesamiento de pagos y analytics avanzados.',
    // ... más descripciones por sector
  };
  
  return descriptions[sector] || 'Proyecto de desarrollo de software personalizado.';
}
```

#### Eventos de Sincronización

```javascript
async createProject(projectData) {
  await this.simulateDelay();
  const newProject = this.generateMockProject(projectData.name);
  
  // Guardar en localStorage
  const projects = this.getAllProjects();
  projects.push(newProject);
  this.saveProjects(projects);

  // Disparar evento personalizado para sincronización
  window.dispatchEvent(new CustomEvent('project-created', {
    detail: { project: newProject }
  }));
  
  return {
    success: true,
    data: newProject
  };
}
```

### `mockDocumentService.js` - Gestión de Documentos

#### Simulación de Subida de Archivos

```javascript
class MockDocumentService {
  // Subir documentos con archivos reales
  async uploadDocuments(projectId, files, stage = 'PRELIMINAR', type = 'CLIENTE') {
    await this.simulateDelay();
    
    const uploadedDocuments = [];
    
    // Procesar cada archivo real
    for (const file of files) {
      // Validar archivo real
      this.validateFile(file);
      
      // Crear documento mock con datos del archivo real
      const document = await this.projectService.uploadDocument(projectId, file, {
        stage,
        type
      });
      
      uploadedDocuments.push(document.data);
    }

    return {
      success: true,
      data: uploadedDocuments,
      message: `${uploadedDocuments.length} documento(s) subido(s) exitosamente`
    };
  }

  // Validación de archivos reales
  validateFile(file) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido: ${file.type}. Solo se permiten PDF y DOCX.`);
    }

    if (file.size > maxSize) {
      throw new Error(`Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo permitido: 10MB.`);
    }

    return true;
  }

  // Simulación de descarga
  async downloadDocument(documentId) {
    await this.simulateDelay();
    
    const document = await this.getDocumentById(documentId);
    
    // Simular blob de descarga
    const content = `Contenido simulado del documento: ${document.data.filename}\n\nEste es un archivo generado por el sistema mock para simular la descarga del documento original.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    
    return {
      success: true,
      data: blob,
      filename: document.data.filename
    };
  }
}
```

### `mockAIService.js` - Inteligencia Artificial Mock

#### Generación de Contenido Realista

```javascript
class MockAIService {
  // Velocidades de procesamiento configurables
  static SPEEDS = {
    fast: { delay: 500, name: 'Rápido' },
    normal: { delay: 1500, name: 'Normal' },
    slow: { delay: 3000, name: 'Lento' }
  };

  // Procesar documentos con IA simulada
  async processDocuments(data) {
    console.log('🧪 MockAIService: Procesando documentos', data);
    
    const { projectId, documentType = 'OBJETIVOS' } = data;
    
    // Simular análisis de documento
    await this.simulateDelay('normal');
    
    // Generar contenido según el tipo
    let generatedContent;
    switch (documentType.toUpperCase()) {
      case 'CLIENTE':
        generatedContent = this.generateClienteDocument(projectId);
        break;
      case 'RELEVAMIENTO':
        generatedContent = this.generateRelevamientoDocument(projectId);
        break;
      case 'INFORME':
        generatedContent = this.generateInformeDocument(projectId);
        break;
      case 'OBJETIVOS':
        generatedContent = this.generateObjetivosDocument(projectId);
        break;
      default:
        generatedContent = this.generateObjetivosDocument(projectId);
    }

    return {
      success: true,
      message: `Documento ${documentType} procesado exitosamente con Test IA Mock`,
      data: generatedContent,
      metadata: {
        provider: 'mock-ai',
        model: 'test-gemini-pro',
        processingTime: '1.5s',
        confidence: 0.95,
        tokensUsed: Math.floor(Math.random() * 5000) + 1000
      }
    };
  }

  // Generar historias de usuario detalladas
  async generateHistoriasUsuario(projectId, configuracion) {
    await this.simulateDelay('normal');
    
    const historias = [
      {
        id: 'HU-001',
        titulo: 'Autenticación de Usuario',
        descripcion: 'Como usuario del sistema quiero poder iniciar sesión de forma segura para acceder a las funcionalidades',
        criteriosAceptacion: [
          'El sistema debe validar credenciales contra la base de datos',
          'Debe mostrar mensaje de error claro si las credenciales son incorrectas',
          'Debe redirigir al dashboard principal si las credenciales son correctas',
          'Debe implementar bloqueo temporal después de 3 intentos fallidos',
          'Debe mantener la sesión activa por 8 horas de inactividad'
        ],
        prioridad: 'Alta',
        estimacion: '5 puntos',
        sprint: 1,
        estado: 'BACKLOG',
        etiquetas: ['seguridad', 'core', 'frontend'],
        dependencias: [],
        notas: 'Considerar implementación de 2FA en el futuro'
      },
      {
        id: 'HU-002',
        titulo: 'Gestión de Proyectos',
        descripcion: 'Como usuario quiero poder crear, editar y eliminar proyectos para organizar mi trabajo',
        criteriosAceptacion: [
          'Debe permitir crear proyecto con nombre, descripción y fecha de inicio',
          'Debe validar que el nombre del proyecto sea único',
          'Debe permitir editar información del proyecto',
          'Debe confirmar antes de eliminar un proyecto',
          'Debe mostrar lista paginada de proyectos'
        ],
        prioridad: 'Alta',
        estimacion: '8 puntos',
        sprint: 1,
        estado: 'BACKLOG',
        etiquetas: ['core', 'crud', 'backend'],
        dependencias: ['HU-001'],
        notas: 'Incluir soft delete para proyectos eliminados'
      },
      // ... más historias detalladas
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
          sprintsEstimados: Math.ceil(historias.length / 5),
          distribuccionPrioridad: {
            alta: historias.filter(h => h.prioridad === 'Alta').length,
            media: historias.filter(h => h.prioridad === 'Media').length,
            baja: historias.filter(h => h.prioridad === 'Baja').length
          }
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'mock-ai-advanced',
          processingTime: '2.3s',
          methodology: 'Agile/Scrum'
        }
      }
    };
  }

  // Chat inteligente simulado
  async chatWithDocuments(chatData) {
    await this.simulateDelay('fast');
    
    const { message, documentContext, conversationHistory } = chatData;
    
    // Generar respuesta contextual
    const responses = [
      `Basándome en los documentos del proyecto, puedo ver que ${message.toLowerCase()} está relacionado con los requisitos principales mencionados en el relevamiento.`,
      `Según el análisis de los documentos subidos, para ${message.toLowerCase()} te recomiendo considerar los siguientes aspectos técnicos...`,
      `Los documentos indican que ${message.toLowerCase()} es una funcionalidad crítica. Te sugiero priorizarla en el sprint 1.`,
      `He analizado el contexto de los documentos y ${message.toLowerCase()} requiere integración con los módulos existentes.`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      success: true,
      data: {
        response: randomResponse,
        confidence: 0.89,
        sources: documentContext || [],
        suggestions: [
          'Revisar requisitos técnicos',
          'Considerar casos de uso adicionales',
          'Validar con stakeholders'
        ],
        followUpQuestions: [
          '¿Necesitas más detalles sobre la implementación?',
          '¿Quieres que analice otros aspectos del proyecto?',
          '¿Te gustaría generar documentación adicional?'
        ]
      },
      metadata: {
        model: 'mock-chat-ai',
        tokensUsed: Math.floor(Math.random() * 500) + 100,
        responseTime: '0.8s'
      }
    };
  }
}
```

## 🎨 Generación de Diagramas Mock

### Diagramas Mermaid Realistas

```javascript
// Generar diagramas de flujo con Mermaid
async generateDiagramasFlujo(projectId, configuracion) {
  await this.simulateDelay('normal');
  
  const diagramas = [
    {
      nombre: 'Flujo de Autenticación',
      tipo: 'flowchart',
      descripcion: 'Proceso completo de login y autenticación de usuarios',
      mermaidCode: `flowchart TD
        A[Usuario accede al sistema] --> B[Mostrar formulario de login]
        B --> C[Ingresar credenciales]
        C --> D{¿Credenciales válidas?}
        D -->|Sí| E[Generar token de sesión]
        D -->|No| F[Incrementar contador de intentos]
        F --> G{¿Intentos < 3?}
        G -->|Sí| H[Mostrar mensaje de error]
        G -->|No| I[Bloquear cuenta temporalmente]
        H --> C
        I --> J[Notificar administrador]
        E --> K[Redirigir a dashboard]
        K --> L[Fin del proceso]
        J --> M[Fin - Cuenta bloqueada]
        
        style A fill:#e1f5fe
        style L fill:#c8e6c9
        style M fill:#ffcdd2`,
      complejidad: 'Media',
      actores: ['Usuario', 'Sistema', 'Base de Datos']
    },
    {
      nombre: 'Gestión de Documentos',
      tipo: 'flowchart',
      descripcion: 'Proceso de subida y procesamiento de documentos',
      mermaidCode: `flowchart TD
        A[Seleccionar archivos] --> B[Validar formato y tamaño]
        B -->|Válido| C[Subir a servidor]
        B -->|Inválido| D[Mostrar error de validación]
        C --> E[Extraer texto automáticamente]
        E --> F[Procesar con IA]
        F --> G[Generar metadatos]
        G --> H[Guardar en base de datos]
        H --> I[Notificar procesamiento completo]
        D --> A
        I --> J[Mostrar en interfaz]
        
        style A fill:#fff3e0
        style J fill:#c8e6c9
        style D fill:#ffcdd2`,
      complejidad: 'Alta',
      actores: ['Usuario', 'Sistema', 'IA', 'Base de Datos']
    }
  ];
  
  return {
    success: true,
    data: {
      projectId,
      documentType: 'DIAGRAMAS_FLUJO',
      diagramas,
      resumen: {
        totalDiagramas: diagramas.length,
        complejidadPromedio: 'Media-Alta',
        actoresInvolucrados: [...new Set(diagramas.flatMap(d => d.actores))],
        tiposGenerados: ['flowchart']
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        tool: 'mermaid',
        version: '10.0.0'
      }
    }
  };
}
```

## 📱 Sistema de Persistencia Avanzado

### Gestión Inteligente de localStorage

```javascript
class MockStorageManager {
  static STORAGE_LIMITS = {
    projects: 50,        // Máximo 50 proyectos
    documents: 200,      // Máximo 200 documentos
    results: 100         // Máximo 100 resultados procesados
  };

  // Limpieza automática cuando se alcanza el límite
  static cleanupOldData(type) {
    const key = `mock${type.charAt(0).toUpperCase() + type.slice(1)}s`;
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (items.length >= this.STORAGE_LIMITS[type]) {
      // Mantener solo los más recientes
      const keepCount = Math.floor(this.STORAGE_LIMITS[type] * 0.8);
      const sorted = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const cleaned = sorted.slice(0, keepCount);
      
      localStorage.setItem(key, JSON.stringify(cleaned));
      console.log(`🧹 Limpieza automática: ${items.length - cleaned.length} ${type} eliminados`);
    }
  }

  // Exportar datos mock para backup
  static exportMockData() {
    const data = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      projects: JSON.parse(localStorage.getItem('mockProjects') || '[]'),
      documents: JSON.parse(localStorage.getItem('mockDocuments') || '[]'),
      results: JSON.parse(localStorage.getItem('mockResults') || '[]'),
      config: JSON.parse(localStorage.getItem('aiConfig') || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return data;
  }

  // Importar datos mock desde backup
  static importMockData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.projects) localStorage.setItem('mockProjects', JSON.stringify(data.projects));
      if (data.documents) localStorage.setItem('mockDocuments', JSON.stringify(data.documents));
      if (data.results) localStorage.setItem('mockResults', JSON.stringify(data.results));
      if (data.config) localStorage.setItem('aiConfig', JSON.stringify(data.config));
      
      console.log('✅ Datos mock importados exitosamente');
      window.location.reload(); // Recargar para reflejar cambios
      
    } catch (error) {
      console.error('❌ Error al importar datos mock:', error);
      throw new Error('Formato de archivo inválido');
    }
  }

  // Resetear todos los datos mock
  static resetAllMockData() {
    const mockKeys = ['mockProjects', 'mockDocuments', 'mockResults', 
                     'mockProjectCounter', 'mockDocumentCounter'];
    
    mockKeys.forEach(key => localStorage.removeItem(key));
    
    console.log('🗑️ Todos los datos mock han sido eliminados');
    window.location.reload();
  }
}
```

## 🎯 Configuraciones Avanzadas

### Configuración de Velocidad de Procesamiento

```javascript
// Configuración en AIConfigContext
const mockSettings = {
  speed: 'normal',              // fast | normal | slow
  realism: 'high',              // low | medium | high
  dataSet: 'comprehensive',     // basic | standard | comprehensive
  errors: {
    frequency: 0.05,            // 5% de probabilidad de error simulado
    types: ['network', 'validation', 'processing']
  },
  delays: {
    fast: { min: 200, max: 800 },
    normal: { min: 800, max: 2000 },
    slow: { min: 2000, max: 5000 }
  }
};

// Aplicación de configuración
async simulateDelay(speed = 'normal') {
  const config = this.getConfigFromStorage();
  const delayConfig = config.mockSettings?.delays?.[speed] || 
                     mockSettings.delays[speed];
  
  const delay = Math.random() * (delayConfig.max - delayConfig.min) + delayConfig.min;
  
  // Simular error ocasional si está configurado
  if (config.mockSettings?.errors?.frequency > 0) {
    if (Math.random() < config.mockSettings.errors.frequency) {
      const errorTypes = config.mockSettings.errors.types;
      const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      throw new Error(`Simulated ${errorType} error for testing`);
    }
  }
  
  return new Promise(resolve => setTimeout(resolve, delay));
}
```

## 🧪 Testing con Sistema Mock

### Ventajas para Testing

#### 1. **Datos Consistentes**
```javascript
// Los mocks siempre devuelven datos predecibles
test('should display project list', async () => {
  // Configurar modo mock
  localStorage.setItem('aiConfig', JSON.stringify({ provider: 'test' }));
  
  render(<ProjectList />);
  
  // Los datos mock siempre están disponibles
  await waitFor(() => {
    expect(screen.getByText('Proyecto Mock')).toBeInTheDocument();
  });
});
```

#### 2. **Sin Dependencias Externas**
```javascript
// No requiere backend funcionando
test('should create project successfully', async () => {
  const newProject = await projectService.createProject({
    name: 'Test Project'
  });
  
  expect(newProject.success).toBe(true);
  expect(newProject.data.name).toBe('Test Project');
  // Datos inmediatamente disponibles en localStorage
});
```

#### 3. **Testing de Casos Edge**
```javascript
// Simular errores de forma controlada
test('should handle upload error gracefully', async () => {
  // Configurar mock para simular error
  mockDocumentService.simulateError = true;
  
  const formData = new FormData();
  formData.append('files', invalidFile);
  
  await expect(documentService.uploadDocuments(formData))
    .rejects.toThrow('Simulated error');
});
```

## 📊 Monitoreo del Sistema Mock

### Dashboard de Estado Mock

```javascript
// Información de estado del sistema mock
const getMockSystemStatus = () => {
  const projects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
  const documents = JSON.parse(localStorage.getItem('mockDocuments') || '[]');
  const results = JSON.parse(localStorage.getItem('mockResults') || '[]');
  
  return {
    active: isTestMode(),
    dataSize: {
      projects: projects.length,
      documents: documents.length,
      results: results.length
    },
    storageUsage: {
      used: new Blob([localStorage.getItem('mockProjects') || '']).size,
      limit: 5 * 1024 * 1024, // 5MB límite estimado
      percentage: Math.round((new Blob([JSON.stringify(localStorage)]).size / (5 * 1024 * 1024)) * 100)
    },
    lastActivity: new Date().toISOString(),
    performance: {
      averageResponseTime: '1.2s',
      successRate: '99.8%',
      errorsSimulated: 12
    }
  };
};
```

### Logs Estructurados del Sistema Mock

```javascript
class MockLogger {
  static log(operation, data, duration) {
    if (import.meta.env.DEV) {
      console.group(`🧪 Mock Operation: ${operation}`);
      console.log('📊 Data:', data);
      console.log('⏱️ Duration:', `${duration}ms`);
      console.log('💾 Storage:', this.getStorageInfo());
      console.groupEnd();
    }
  }
  
  static getStorageInfo() {
    const projects = JSON.parse(localStorage.getItem('mockProjects') || '[]');
    return {
      projects: projects.length,
      totalSize: new Blob([JSON.stringify(localStorage)]).size
    };
  }
}

// Uso en servicios mock
async createProject(projectData) {
  const startTime = performance.now();
  
  await this.simulateDelay();
  const newProject = this.generateMockProject(projectData.name);
  
  // ... lógica del método
  
  const duration = performance.now() - startTime;
  MockLogger.log('createProject', newProject, duration);
  
  return { success: true, data: newProject };
}
```

## 🔮 Roadmap del Sistema Mock

### Features Planificadas

#### Versión 1.1
- [ ] **Modo Offline Completo**: Funcionalidad sin conexión a internet
- [ ] **Import/Export de Datos**: Backup y restauración de datos mock
- [ ] **Configuración Avanzada**: Más opciones de personalización
- [ ] **Métricas Detalladas**: Dashboard de rendimiento mock

#### Versión 1.2
- [ ] **Simulación de Red**: Latencia y errores de red realistas
- [ ] **Datos Relacionales**: Mejor gestión de relaciones entre entidades
- [ ] **Webhooks Mock**: Simulación de eventos externos
- [ ] **A/B Testing**: Diferentes conjuntos de datos para testing

---

**Mantenido por**: Equipo de Testing y Mock Systems  
**Última actualización**: Octubre 2025