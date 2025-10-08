# Documentación de Componentes React

## 📋 Índice de Componentes

Este documento describe todos los componentes React del sistema ProjectManagerMind IA, organizados por categoría y funcionalidad.

## 🏗️ Componentes de Layout

### `MainLayout.jsx`
**Propósito:** Layout principal de la aplicación que organiza la estructura base.

**Ubicación:** `/src/components/layout/MainLayout.jsx`

**Props:**
```javascript
{
  children: ReactNode,              // Contenido principal
  sidebarOpen?: boolean,           // Estado del sidebar
  onSidebarToggle?: () => void     // Callback para toggle del sidebar
}
```

**Estructura:**
```jsx
<div className="main-layout">
  <Header onMenuToggle={onSidebarToggle} />
  <div className="main-layout__content">
    <Sidebar isOpen={sidebarOpen} />
    <main className="main-layout__main">
      {children}
    </main>
  </div>
</div>
```

### `Header.jsx`
**Propósito:** Cabecera principal con navegación y controles globales.

**Features:**
- Logo de la aplicación
- Botón de configuración de IA
- Indicadores de estado
- Menu hamburguesa (responsive)

### `Sidebar.jsx`
**Propósito:** Navegación lateral con acceso a las diferentes secciones.

**Features:**
- Navegación principal
- Estado colapsible
- Indicadores de estado activo
- Responsive design

## 🎯 Componentes de Features

### Gestión de Proyectos

#### `CreateProjectModal.jsx`
**Propósito:** Modal para crear nuevos proyectos.

**Estado interno:**
```javascript
{
  isOpen: boolean,                 // Visibilidad del modal
  formData: {
    name: string,                  // Nombre del proyecto
    description: string,           // Descripción
    clientName: string             // Nombre del cliente
  },
  loading: boolean,                // Estado de carga
  error: string | null             // Mensajes de error
}
```

**Métodos principales:**
- `handleSubmit()` - Procesamiento del formulario
- `handleClose()` - Cierre del modal
- `validateForm()` - Validación de datos

**Integración con servicios:**
```javascript
// Detección automática de modo
const result = await projectService.createProject(formData);
// En modo mock: guarda en localStorage
// En modo producción: hace llamada HTTP
```

#### `ProjectCard.jsx`
**Propósito:** Tarjeta individual de proyecto con información resumida.

**Props:**
```javascript
{
  project: {
    id: string,
    name: string,
    description: string,
    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED',
    createdAt: string,
    _count: {
      documents: number,
      processedResults: number
    }
  },
  onSelect?: (project) => void,    // Callback de selección
  selected?: boolean               // Estado seleccionado
}
```

**Características:**
- Información de proyecto compacta
- Contadores de documentos y resultados
- Estados visuales (activo, completado, pausado)
- Hover effects y selección

### Gestión de Documentos

#### `SourcesPanel.jsx`
**Propósito:** Panel principal para gestión de documentos y fuentes del proyecto.

**Estado complejo:**
```javascript
{
  projects: Project[],             // Lista de proyectos
  selectedProject: Project | null, // Proyecto seleccionado
  projectFiles: {                 // Archivos organizados
    PRELIMINAR: {
      types: {
        CLIENTE: { files: Document[] },
        RELEVAMIENTO: { files: Document[] },
        // ... otros tipos
      }
    },
    // ... otras etapas
  },
  loading: boolean,
  error: string | null
}
```

**Hooks utilizados:**
- `useCallback` - Optimización de funciones
- `useEffect` - Efectos de carga de datos
- `useState` - Estado local del componente

**Features principales:**
- Carga automática de proyectos al montar
- Selección automática del primer proyecto
- Organización jerárquica de documentos
- Integración con sistema de eventos
- Soporte para modo mock completo

#### `UploadModal.jsx`
**Propósito:** Modal para subida de documentos con configuración.

**Props de configuración:**
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  projectId: string,
  onUploadComplete: (documents) => void
}
```

**Estado del formulario:**
```javascript
{
  files: File[],                   // Archivos seleccionados
  stage: 'PRELIMINAR' | 'ANALISIS' | 'DISENO',
  type: 'CLIENTE' | 'RELEVAMIENTO' | 'INFORME' | 'OBJETIVOS',
  uploading: boolean,
  progress: number,                // Progreso de subida
  error: string | null
}
```

**Validaciones:**
- Tipos de archivo permitidos (PDF, DOCX)
- Tamaño máximo de archivo
- Validación de metadatos obligatorios

### Inteligencia Artificial

#### `AISettingsButton.jsx`
**Propósito:** Botón flotante para configuración de proveedor de IA.

**Context utilizado:**
```javascript
const { config, updateProvider } = useAIConfig();
```

**Funcionalidades:**
- Selector de proveedor de IA
- Indicador visual del proveedor activo
- Configuración persistente en localStorage
- Integración con sistema mock

#### `ChatInterface.jsx`
**Propósito:** Interfaz de chat con documentos usando IA.

**Estado del chat:**
```javascript
{
  messages: Message[],             // Historial de mensajes
  currentMessage: string,          // Mensaje actual
  loading: boolean,                // Esperando respuesta
  selectedDocuments: string[]      // Documentos para contexto
}
```

**Tipos de mensaje:**
```javascript
type Message = {
  id: string,
  role: 'user' | 'assistant',
  content: string,
  timestamp: string,
  documentContext?: string[]       // Referencias a documentos
}
```

### Análisis y Estudios

#### `StudyPanel.jsx`
**Propósito:** Panel principal para generación y visualización de estudios.

**Estado de estudios:**
```javascript
{
  activeStudy: Study | null,       // Estudio activo
  studyHistory: Study[],           // Historial de estudios
  configuration: StudyConfig,      // Configuración actual
  generating: boolean,             // Estado de generación
  aiInfo: AIProviderInfo          // Información del proveedor IA
}
```

**Tipos de estudios soportados:**
- Relevamiento técnico
- Informe ejecutivo
- Historias de usuario
- Diagramas de flujo
- Sprint planning
- Diagramas DER

#### `DERViewer.jsx` / `DERViewerHardcoded.jsx`
**Propósito:** Visualizador de diagramas entidad-relación.

**Props:**
```javascript
{
  derData: {
    entities: Entity[],            // Entidades del diagrama
    relationships: Relationship[], // Relaciones
    mermaidCode: string           // Código Mermaid generado
  },
  interactive?: boolean,          // Modo interactivo
  onEntityClick?: (entity) => void
}
```

**Features:**
- Renderizado de diagramas Mermaid
- Visualización interactiva de entidades
- Export a diferentes formatos
- Zoom y pan para diagramas grandes

## 🧩 Componentes UI Reutilizables

### `Button.jsx`
**Propósito:** Botón personalizado con variantes y estados.

**Props:**
```javascript
{
  variant: 'primary' | 'secondary' | 'danger' | 'outline',
  size: 'small' | 'medium' | 'large',
  loading?: boolean,              // Estado de carga
  disabled?: boolean,
  icon?: ReactNode,              // Icono opcional
  children: ReactNode,           // Contenido del botón
  onClick?: () => void
}
```

**Variantes de estilo:**
- **Primary**: Acción principal (azul)
- **Secondary**: Acción secundaria (gris)
- **Danger**: Acciones destructivas (rojo)
- **Outline**: Versión con borde

### `Modal.jsx`
**Propósito:** Modal base reutilizable con backdrop y animaciones.

**Props:**
```javascript
{
  isOpen: boolean,               // Visibilidad
  onClose: () => void,          // Callback de cierre
  title?: string,               // Título opcional
  size?: 'small' | 'medium' | 'large' | 'xlarge',
  closeOnBackdrop?: boolean,    // Cerrar al click en backdrop
  children: ReactNode           // Contenido del modal
}
```

**Features:**
- Overlay con backdrop animado
- Escape key para cerrar
- Scroll interno cuando el contenido es largo
- Responsive en diferentes breakpoints

### `LoadingSpinner.jsx`
**Propósito:** Indicador de carga con diferentes tamaños y contextos.

**Props:**
```javascript
{
  size?: 'small' | 'medium' | 'large',
  overlay?: boolean,            // Mostrar como overlay
  message?: string             // Mensaje de carga
}
```

## 🔧 Hooks Personalizados

### `useAsyncData.js`
**Propósito:** Hook para gestión de datos asíncronos con estados de loading y error.

**Signatura:**
```javascript
const { data, loading, error, execute } = useAsyncData(
  fetchFunction,                  // Función async a ejecutar
  dependencies = []              // Dependencias para re-ejecución
);
```

**Retorna:**
```javascript
{
  data: T | null,                // Datos obtenidos
  loading: boolean,              // Estado de carga
  error: Error | null,           // Error si ocurrió
  execute: () => Promise<void>   // Función para re-ejecutar
}
```

**Uso típico:**
```javascript
const { data: projects, loading, error, execute: loadProjects } = useAsyncData(
  () => projectService.getProjects(),
  []
);
```

### `useDocumentTypes.js`
**Propósito:** Hook para obtener tipos de documentos disponibles por etapa.

**Retorna:**
```javascript
{
  getTypesByStage: (stage: string) => DocumentType[],
  getAllTypes: () => DocumentType[],
  getStages: () => ProjectStage[]
}
```

### `useNotifications.js`
**Propósito:** Hook para gestión de notificaciones toast.

**API:**
```javascript
const { notify, clearAll } = useNotifications();

// Uso
notify.success('Proyecto creado exitosamente');
notify.error('Error al subir documento');
notify.info('Procesando documento...');
notify.warning('Revisa la configuración');
```

## 🎨 Patrones de Componentes

### Container/Presentational Pattern

**Container Component (lógica):**
```javascript
const ProjectListContainer = () => {
  const { data: projects, loading, error } = useAsyncData(
    () => projectService.getProjects()
  );
  
  const handleProjectSelect = useCallback((project) => {
    // Lógica de selección
  }, []);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <ProjectListPresentation 
      projects={projects}
      onProjectSelect={handleProjectSelect}
    />
  );
};
```

**Presentational Component (UI pura):**
```javascript
const ProjectListPresentation = ({ projects, onProjectSelect }) => (
  <div className="project-list">
    {projects.map(project => (
      <ProjectCard
        key={project.id}
        project={project}
        onSelect={onProjectSelect}
      />
    ))}
  </div>
);
```

### Compound Components Pattern

**Para componentes complejos como modals:**
```javascript
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <Modal.Title>Crear Proyecto</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <ProjectForm onSubmit={handleSubmit} />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Cancelar</Button>
    <Button variant="primary" onClick={handleSave}>Guardar</Button>
  </Modal.Footer>
</Modal>
```

### Render Props Pattern

**Para componentes de datos reutilizables:**
```javascript
const DataProvider = ({ children, fetchFn }) => {
  const { data, loading, error } = useAsyncData(fetchFn);
  
  return children({ data, loading, error });
};

// Uso
<DataProvider fetchFn={() => projectService.getProjects()}>
  {({ data: projects, loading, error }) => (
    loading ? <LoadingSpinner /> :
    error ? <ErrorMessage error={error} /> :
    <ProjectList projects={projects} />
  )}
</DataProvider>
```

## 🔄 Ciclo de Vida de Componentes

### Montaje (Mounting)
1. **Constructor/useState** - Inicialización del estado
2. **useEffect con []** - Efectos de montaje (cargar datos)
3. **Render inicial** - Primera renderización
4. **useEffect sin deps** - Efectos que corren después del render

### Actualización (Updating)
1. **Props/State change** - Cambio de propiedades o estado
2. **Re-render** - Nueva renderización
3. **useEffect con deps** - Efectos dependientes de cambios
4. **Cleanup functions** - Limpieza de efectos previos

### Desmontaje (Unmounting)
1. **useEffect cleanup** - Funciones de limpieza
2. **Event listeners removal** - Limpieza de event listeners
3. **Timers/intervals clear** - Limpieza de timers

## 🧪 Testing de Componentes

### Testing Strategy

#### Unit Tests
```javascript
// Ejemplo para ProjectCard.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from './ProjectCard';

test('should display project information', () => {
  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
    status: 'ACTIVE'
  };
  
  render(<ProjectCard project={mockProject} />);
  
  expect(screen.getByText('Test Project')).toBeInTheDocument();
  expect(screen.getByText('Test Description')).toBeInTheDocument();
});
```

#### Integration Tests
```javascript
// Ejemplo para flujo completo
test('should create project and update list', async () => {
  render(<App />);
  
  fireEvent.click(screen.getByText('Crear Proyecto'));
  fireEvent.change(screen.getByLabelText('Nombre'), {
    target: { value: 'Nuevo Proyecto' }
  });
  fireEvent.click(screen.getByText('Guardar'));
  
  await waitFor(() => {
    expect(screen.getByText('Nuevo Proyecto')).toBeInTheDocument();
  });
});
```

## 📋 Checklist de Componentes Nuevos

Al crear un nuevo componente, verificar:

- [ ] **Ubicación correcta** según su propósito (features/layout/ui)
- [ ] **Props definidas** con PropTypes o TypeScript
- [ ] **Estado mínimo** necesario (preferir props sobre estado)
- [ ] **Efectos optimizados** con dependencias correctas
- [ ] **Funciones memoizadas** con useCallback cuando sea necesario
- [ ] **Estilos organizados** en archivo CSS correspondiente
- [ ] **Accesibilidad** (ARIA labels, keyboard navigation)
- [ ] **Responsive design** para diferentes breakpoints
- [ ] **Testing** con casos básicos y edge cases
- [ ] **Documentación** actualizada en este archivo

---

**Mantenido por**: Equipo de Desarrollo Frontend  
**Última actualización**: Octubre 2025