# Arquitectura del Frontend

## 🏗️ Visión General de la Arquitectura

ProjectManagerMind IA Frontend está construido con una arquitectura modular y escalable basada en React 18, siguiendo patrones modernos de desarrollo frontend.

## 📐 Patrón Arquitectónico

### Arquitectura por Capas

```
┌─────────────────────────────────────────┐
│                UI Layer                 │
│     Components + Layout + Styles       │
├─────────────────────────────────────────┤
│              Service Layer              │
│    API Services + Mock Services        │
├─────────────────────────────────────────┤
│             Context Layer               │
│       State Management + Events        │
├─────────────────────────────────────────┤
│              Utils Layer                │
│     Helpers + Constants + Hooks        │
└─────────────────────────────────────────┘
```

### Principios de Diseño

#### 1. **Separación de Responsabilidades**
- **Componentes UI**: Solo lógica de presentación
- **Servicios**: Comunicación con APIs y lógica de negocio
- **Context**: Gestión de estado global
- **Hooks**: Lógica reutilizable

#### 2. **Composición sobre Herencia**
- Componentes pequeños y reutilizables
- HOCs (Higher-Order Components) para funcionalidad compartida
- Custom hooks para lógica de estado

#### 3. **Inversión de Dependencias**
- Servicios abstractos con implementaciones intercambiables
- Sistema mock transparente para testing

## 🔧 Stack Tecnológico

### Core Technologies
- **React 18.2.0** - UI Library con Concurrent Features
- **Vite 5.4.1** - Build Tool y Dev Server
- **JavaScript ES2022** - Lenguaje principal

### Gestión de Estado
- **Context API** - Estado global reactivo
- **useState/useReducer** - Estado local de componentes
- **LocalStorage** - Persistencia de datos

### Comunicación HTTP
- **Axios** - Cliente HTTP con interceptors
- **Mock Services** - Simulación completa de APIs

### Styling
- **CSS Modules** - Estilos componetizados
- **CSS Custom Properties** - Variables y theming
- **Responsive Design** - Mobile-first approach

## 🏭 Patrones de Implementación

### 1. Container/Presentational Pattern

```javascript
// Container Component (lógica)
const ProjectContainer = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ProjectList 
      projects={projects}
      loading={loading}
      onLoad={loadProjects}
    />
  );
};

// Presentational Component (UI pura)
const ProjectList = ({ projects, loading, onLoad }) => (
  <div className="project-list">
    {loading ? <Spinner /> : projects.map(project => 
      <ProjectCard key={project.id} project={project} />
    )}
  </div>
);
```

### 2. Service Layer Pattern

```javascript
// Servicio abstracto
class ProjectService {
  async getProjects() {
    if (isTestMode()) {
      return await mockProjectService.getProjects();
    }
    return await this.apiCall('/api/v1/projects');
  }
}
```

### 3. Context Provider Pattern

```javascript
// Context con Provider
const AIConfigContext = createContext();

export const AIConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => 
    JSON.parse(localStorage.getItem('aiConfig') || '{}')
  );
  
  const updateProvider = (provider) => {
    const newConfig = { ...config, provider };
    setConfig(newConfig);
    localStorage.setItem('aiConfig', JSON.stringify(newConfig));
  };
  
  return (
    <AIConfigContext.Provider value={{ config, updateProvider }}>
      {children}
    </AIConfigContext.Provider>
  );
};
```

### 4. Custom Hooks Pattern

```javascript
// Hook personalizado para datos async
export const useAsyncData = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);
  
  return { data, loading, error, execute };
};
```

## 🔄 Flujo de Datos

### Flujo Unidireccional

```
User Action → Component Handler → Service Call → Context Update → UI Re-render
     ↑                                                                  ↓
UI Event ←←←←←←←←← Component Effect ←←←←←← State Change ←←←←←←←←←←←←
```

### Ejemplo de Flujo Completo

1. **Acción del Usuario**: Click en "Crear Proyecto"
2. **Handler del Componente**: `handleCreateProject()`
3. **Llamada al Servicio**: `projectService.createProject(data)`
4. **Detección de Modo**: Verifica si es Test IA o producción
5. **Ejecución**: Mock o API real según el modo
6. **Actualización de Estado**: Context actualiza lista de proyectos
7. **Re-render**: Componentes reflejan el nuevo estado
8. **Persistencia**: LocalStorage guarda cambios (en modo mock)

## 🎯 Decisiones Arquitectónicas

### ¿Por qué Context API en lugar de Redux?

**Ventajas del Context API:**
- Menor complejidad y boilerplate
- Integración nativa con React
- Suficiente para el tamaño del proyecto
- Mejor rendimiento para estados específicos

**Casos donde usamos Context:**
- Configuración de IA global
- Información de usuario
- Preferencias del sistema

### ¿Por qué Sistema Mock Integrado?

**Beneficios:**
- Desarrollo independiente del backend
- Testing más rápido y confiable
- Demos sin infraestructura
- Desarrollo offline

**Implementación:**
- Detección automática por configuración
- Respuestas consistentes con API real
- Datos realistas para testing

### ¿Por qué Vite sobre Create React App?

**Ventajas de Vite:**
- Build y HMR más rápido
- Configuración más flexible
- Mejor tree-shaking
- Support nativo para ES modules

## 🔐 Seguridad en el Frontend

### Validación de Datos
- Validación en cliente y servidor
- Sanitización de inputs
- Validación de tipos de archivo

### Gestión de Tokens
- No almacenamiento de tokens sensibles
- Headers seguros para comunicación HTTP
- Timeout automático de sesiones

### XSS Prevention
- Escape automático de JSX
- Validación de URLs externas
- Content Security Policy headers

## 📊 Rendimiento

### Optimizaciones Implementadas

#### Code Splitting
```javascript
// Lazy loading de componentes
const DERViewer = lazy(() => import('./components/DERViewer'));
const StudyPanel = lazy(() => import('./components/StudyPanel'));
```

#### Memoización
```javascript
// Memorización de componentes costosos
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => 
    processLargeDataset(data), [data]
  );
  
  return <DataVisualization data={processedData} />;
});
```

#### Gestión de Estado Eficiente
```javascript
// Context específicos en lugar de uno global
const useProjectContext = () => useContext(ProjectContext);
const useAIContext = () => useContext(AIContext);
```

### Métricas de Rendimiento
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: ~1.5MB (gzipped ~440KB)

## 🧪 Testabilidad

### Estrategias de Testing

#### Unit Testing
- Componentes aislados
- Hooks personalizados
- Servicios mock

#### Integration Testing
- Flujos completos de usuario
- Interacción entre componentes
- Context providers

#### E2E Testing
- Flujos críticos del negocio
- Sistema mock para estabilidad
- Validación cross-browser

## 🔮 Escalabilidad Futura

### Consideraciones de Crecimiento

#### Micro-Frontends
- Preparado para separación por dominios
- Servicios desacoplados
- Estados independientes

#### Internacionalización
- Estructura preparada para i18n
- Separación de contenido y lógica
- Context para idiomas

#### PWA Capabilities
- Service Workers configurables
- Offline-first approach con mocks
- Cache strategies implementables

---

**Mantenido por**: Equipo de Arquitectura Frontend  
**Última revisión**: Octubre 2025