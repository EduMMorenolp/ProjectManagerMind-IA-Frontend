# Estructura de Carpetas del Frontend

## 📁 Vista General de la Estructura

```
frontend/
├── public/                          # Archivos estáticos públicos
│   ├── notebook-ia-192.svg         # Logo aplicación (192px)
│   └── notebook-ia.svg             # Logo aplicación (vectorial)
├── src/                             # Código fuente principal
│   ├── components/                  # Componentes React organizados
│   │   ├── features/               # Componentes específicos de features
│   │   ├── layout/                 # Componentes de layout (header, sidebar)
│   │   ├── test/                   # Componentes de testing
│   │   └── ui/                     # Componentes UI reutilizables
│   ├── constants/                   # Constantes y configuraciones
│   ├── contexts/                    # Context Providers de React
│   ├── hooks/                       # Custom hooks reutilizables
│   ├── services/                    # Servicios de API y mock
│   ├── styles/                      # Estilos globales y por componente
│   ├── utils/                       # Utilidades y helpers
│   ├── App.jsx                      # Componente raíz de la aplicación
│   └── main.jsx                     # Punto de entrada de React
├── eslint.config.js                 # Configuración de ESLint
├── index.html                       # Plantilla HTML principal
├── package.json                     # Dependencias y scripts
├── README.md                        # Documentación del proyecto
└── vite.config.js                   # Configuración de Vite
```

## 🎯 Principios de Organización

### 1. **Feature-Based Organization**
Los componentes se organizan por funcionalidad, no por tipo técnico.

### 2. **Separation of Concerns**
Cada carpeta tiene una responsabilidad específica y bien definida.

### 3. **Scalability First**
La estructura permite agregar nuevas features sin reestructurar.

## 📂 Detalle de Carpetas Principales

### `/src/components/`

Contiene todos los componentes React organizados por propósito:

#### `/src/components/features/` - Componentes de Funcionalidades

```
features/
├── AI/                              # Funcionalidades de IA
│   ├── AISettingsButton.jsx        # Botón configuración IA
│   ├── ChatInterface.jsx           # Interfaz de chat
│   └── SettingsModal.jsx           # Modal de configuración
├── Analytics/                       # Análisis y métricas
│   ├── AnalyticsPanel.jsx          # Panel principal de analytics
│   └── MetricsDisplay.jsx          # Visualización de métricas
├── DER/                            # Diagramas Entidad-Relación
│   ├── DERViewer.jsx               # Visualizador de DER
│   └── DERViewerHardcoded.jsx      # Versión con datos mock
├── Documents/                       # Gestión de documentos
│   ├── DocumentList.jsx            # Lista de documentos
│   ├── SourcesPanel.jsx            # Panel principal de fuentes
│   └── UploadModal.jsx             # Modal de subida de archivos
├── Projects/                        # Gestión de proyectos
│   ├── CreateProjectModal.jsx      # Modal creación de proyecto
│   ├── ProjectCard.jsx             # Tarjeta de proyecto
│   └── ProjectList.jsx             # Lista de proyectos
└── Studies/                         # Estudios y análisis
    ├── StudyPanel.jsx              # Panel principal de estudios
    └── StudyConfiguration.jsx      # Configuración de estudios
```

**Convenciones:**
- Un componente por archivo
- Nombres en PascalCase
- Sufijo `.jsx` para componentes React
- Versiones "Hardcoded" para desarrollo con datos mock

#### `/src/components/layout/` - Componentes de Layout

```
layout/
├── Header.jsx                       # Cabecera principal
├── Sidebar.jsx                      # Barra lateral de navegación
├── MainLayout.jsx                   # Layout principal de la app
└── LoadingSpinner.jsx               # Indicador de carga global
```

**Propósito:** Componentes que definen la estructura visual y navegación de la aplicación.

#### `/src/components/ui/` - Componentes UI Reutilizables

```
ui/
├── Button.jsx                       # Botón personalizado
├── Modal.jsx                        # Modal base reutilizable
├── Input.jsx                        # Input personalizado
├── Select.jsx                       # Select personalizado
├── Card.jsx                         # Tarjeta base
├── Badge.jsx                        # Badge/Etiqueta
└── Toast.jsx                        # Notificaciones toast
```

**Propósito:** Componentes de UI genéricos y reutilizables sin lógica de negocio.

#### `/src/components/test/` - Componentes de Testing

```
test/
├── MockDataDisplay.jsx              # Visualización de datos mock
├── DebugPanel.jsx                   # Panel de debugging
└── TestControls.jsx                 # Controles para testing
```

**Propósito:** Componentes específicos para desarrollo y testing.

### `/src/services/` - Capa de Servicios

```
services/
├── config.js                        # Configuración de Axios
├── aiService.js                     # Servicios de IA (Gemini, OpenAI, Mock)
├── documentService.js               # Gestión de documentos
├── projectService.js                # Gestión de proyectos
├── systemService.js                 # Servicios del sistema
├── workflowService.js               # Flujos de trabajo
├── mockAIService.js                 # Servicio mock de IA
├── mockDocumentService.js           # Servicio mock de documentos
├── mockProjectService.js            # Servicio mock de proyectos
├── index.js                         # Barrel exports
└── README.md                        # Documentación de servicios
```

**Arquitectura de Servicios:**

#### Servicios Principales
- **Detección automática** de modo (producción vs test)
- **Interface unificada** independiente del backend
- **Fallback automático** a servicios mock

#### Servicios Mock
- **Simulación completa** de APIs del backend
- **Datos realistas** para desarrollo y testing
- **Persistencia local** con localStorage
- **Delays realistas** para simular latencia de red

### `/src/contexts/` - Gestión de Estado Global

```
contexts/
├── AIConfigContext.jsx              # Configuración de IA global
├── StudyContext.jsx                 # Estado de estudios activos
└── index.js                         # Barrel exports
```

**Patrón de Context:**
```javascript
// Estructura típica de un Context
export const AIConfigContext = createContext();

export const AIConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(initialState);
  
  return (
    <AIConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </AIConfigContext.Provider>
  );
};

export const useAIConfig = () => {
  const context = useContext(AIConfigContext);
  if (!context) throw new Error('useAIConfig must be used within AIConfigProvider');
  return context;
};
```

### `/src/hooks/` - Custom Hooks

```
hooks/
├── useAsyncData.js                  # Hook para datos asíncronos
├── useDocumentTypes.js              # Hook para tipos de documentos
├── useNotifications.js              # Hook para notificaciones
└── index.js                         # Barrel exports
```

**Patrones de Hooks:**
- **Reutilización de lógica** entre componentes
- **Abstracción de efectos** complejos
- **Gestión de estado** específico

### `/src/constants/` - Constantes y Configuración

```
constants/
├── index.js                         # Constantes generales
└── aiProviders.js                   # Configuración de proveedores IA
```

**Ejemplo de estructura:**
```javascript
// aiProviders.js
export const AI_PROVIDERS = {
  GEMINI: {
    id: 'gemini',
    name: 'Google Gemini Pro',
    description: 'Modelo avanzado de Google',
    available: true
  },
  TEST: {
    id: 'test',
    name: 'Test IA (Mock)',
    description: 'Simulador para desarrollo',
    available: true
  }
};
```

### `/src/styles/` - Estilos y CSS

```
styles/
├── base.css                         # Estilos base y reset
├── main.css                         # Estilos principales
├── upload-modal.css                 # Estilos específicos de modal
└── components/                      # Estilos por componente
    ├── header.css                   # Estilos del header
    ├── sidebar.css                  # Estilos del sidebar
    └── sources-panel.css            # Estilos del panel de fuentes
```

**Estrategia de Estilos:**

#### CSS Custom Properties (Variables)
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
}
```

#### BEM Methodology
```css
/* Block */
.sources-panel { }

/* Element */
.sources-panel__header { }
.sources-panel__content { }

/* Modifier */
.sources-panel--loading { }
.sources-panel__header--expanded { }
```

### `/src/utils/` - Utilidades y Helpers

```
utils/
├── index.js                         # Utilidades generales
├── formatters.js                    # Formateo de datos
├── validators.js                    # Validaciones
└── constants.js                     # Constantes específicas
```

**Tipos de Utilidades:**
- **Formateo** de fechas, números, texto
- **Validación** de formularios y datos
- **Helpers** para manipulación de arrays y objetos
- **Conversiones** de formato de datos

## 🗂️ Convenciones de Nomenclatura

### Archivos y Carpetas
- **Componentes**: PascalCase (`ProjectCard.jsx`)
- **Hooks**: camelCase con prefijo `use` (`useAsyncData.js`)
- **Servicios**: camelCase con sufijo `Service` (`projectService.js`)
- **Constantes**: UPPER_SNAKE_CASE (`AI_PROVIDERS`)
- **Carpetas**: camelCase (`components/features`)

### Importaciones y Exports

#### Barrel Exports Pattern
```javascript
// src/services/index.js
export { default as projectService } from './projectService.js';
export { default as documentService } from './documentService.js';
export { default as aiService } from './aiService.js';

// Uso en componentes
import { projectService, aiService } from '../services';
```

#### Named vs Default Exports
- **Default exports**: Para componentes principales y servicios
- **Named exports**: Para utilidades, constantes y múltiples exports

## 📋 Archivo de Configuración Principal

### `package.json` - Dependencias y Scripts

```json
{
  "scripts": {
    "dev": "vite",                    # Servidor de desarrollo
    "build": "vite build",            # Build de producción
    "preview": "vite preview",        # Preview del build
    "lint": "eslint . --ext js,jsx"   # Linting del código
  },
  "dependencies": {
    "react": "^18.2.0",              # Biblioteca principal
    "react-dom": "^18.2.0",          # DOM bindings
    "axios": "^1.7.7"                # Cliente HTTP
  }
}
```

### `vite.config.js` - Configuración de Build

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,                       # Puerto de desarrollo
    host: true                        # Acceso desde red local
  },
  build: {
    outDir: 'dist',                   # Directorio de salida
    sourcemap: true                   # Source maps para debugging
  }
});
```

## 🔄 Flujo de Desarrollo

### Agregar Nueva Feature

1. **Crear componente** en `/src/components/features/NewFeature/`
2. **Agregar servicios** necesarios en `/src/services/`
3. **Crear hooks** si hay lógica reutilizable en `/src/hooks/`
4. **Definir contexto** si requiere estado global en `/src/contexts/`
5. **Agregar estilos** en `/src/styles/components/`
6. **Exportar** en archivos `index.js` correspondientes

### Reglas de Importación

```javascript
// ✅ Importaciones ordenadas
import React, { useState, useEffect } from 'react';      // React primero
import axios from 'axios';                               // Librerías externas
import { projectService } from '../services';           // Servicios internos
import { useAsyncData } from '../hooks';                 // Hooks personalizados  
import Button from '../components/ui/Button';           # Componentes internos
import './ComponentName.css';                           // Estilos al final
```

---

**Mantenido por**: Equipo de Desarrollo Frontend  
**Última actualización**: Octubre 2025