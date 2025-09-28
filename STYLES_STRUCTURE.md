# Estructura de Estilos - Notebook IA

## Nueva Organización de Archivos CSS

### 📁 Estructura de Directorios
```
frontend/src/styles/
├── base.css                              # Variables globales, reset, utilidades comunes
├── main.css                              # Archivo principal que importa todos los estilos
├── upload-modal.css                      # Estilos existentes del modal de upload
└── components/
    ├── App.css                          # Estilos del componente App principal
    ├── features/
    │   ├── SourcesPanel.css             # Estilos del panel de fuentes
    │   ├── ChatPanel.css                # Estilos del panel de chat
    │   ├── StudyPanel.css               # Estilos del panel de estudio
    │   └── StudySections.css            # Estilos de las secciones del panel de estudio
    └── ui/
        └── common.css                   # Componentes UI comunes (botones, modales, etc.)
```

### 📄 Archivos Principales

#### `base.css`
- Variables CSS globales (:root)
- Reset básico de CSS
- Estilos base del body y #root
- Utilidades comunes (loading, error-message, icon-button)
- Keyframes y animaciones globales

#### `main.css`
- Importa todos los archivos de estilos
- Estilos globales que no caben en base.css
- Overrides globales
- Estilos legacy que aún no se han movido

#### `components/App.css`
- Estilos del contenedor principal (.app-container)
- Header de la aplicación (.app-header)
- Layout principal (.app-main)
- Estilos base de los paneles
- Media queries responsivas para el layout principal

#### `components/features/SourcesPanel.css`
- Contenedor del panel (.sources-panel-container)
- Header del panel (.sources-header)
- Lista de archivos (.files-list, .file-item)
- Organización por etapas
- Estilos específicos del panel de fuentes

#### `components/features/ChatPanel.css`
- Contenedor del chat (.chat-panel-container)
- Mensajes (.message, .message-content)
- Input de chat (.chat-input-container)
- Indicador de carga (.loading-indicator)
- Animaciones específicas del chat

#### `components/features/StudyPanel.css`
- Contenedor del panel (.study-panel-container)
- Tabs de navegación (.study-tabs, .tab-button)
- Contenido de tabs (.generate-container, .results-container)
- Estilos de generación y resultados

#### `components/features/StudySections.css`
- Navegación por etapas (.project-stages, .stage-group)
- Secciones específicas (.section-container, .section-header)
- Formularios de cliente (.client-form, .form-row)
- Grids de contenido (.methods-grid, .objectives-grid)
- Botones de generación (.generate-button)

#### `components/ui/common.css`
- Modales (.modal-overlay, .modal-content)
- Formularios genéricos (.form-container, .form-group)
- Botones genéricos (.btn, .btn-primary, .btn-secondary)
- Cards (.card, .card-header, .card-body)
- Badges (.badge, .badge-primary)
- Upload de archivos (.file-upload)
- Tablas (.table)

### 🔄 Importación en Componentes

#### Archivo principal (App.jsx)
```jsx
import './styles/main.css'
```

#### Componentes individuales (opcional para estilos específicos)
```jsx
// En SourcesPanel.jsx
import '../../../styles/components/features/SourcesPanel.css';

// En ChatPanel.jsx  
import '../../../styles/components/features/ChatPanel.css';

// En StudyPanel.jsx
import '../../../styles/components/features/StudyPanel.css';
```

### 🎯 Beneficios de esta Estructura

1. **Organización Clara**: Cada componente tiene su archivo CSS correspondiente
2. **Mantenimiento Fácil**: Es fácil encontrar los estilos de un componente específico
3. **Reutilización**: Los estilos comunes están en archivos separados
4. **Escalabilidad**: Es fácil agregar nuevos componentes y sus estilos
5. **Responsividad**: Media queries organizadas por componente
6. **Performance**: Importación selectiva de estilos cuando sea necesario

### 📱 Responsividad

Cada archivo de componente incluye sus propias media queries:
- **Desktop**: > 1200px
- **Tablet Landscape**: 1024px - 1200px  
- **Tablet Portrait**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### 🔧 Variables CSS Disponibles

Todas definidas en `base.css`:
- **Colores**: --primary-color, --secondary-color, --accent-color, etc.
- **Sombras**: --shadow-sm, --shadow-md, --shadow-lg
- **Radios**: --radius-sm, --radius-md, --radius-lg  
- **Fuentes**: --font-sans, --font-mono
- **Espaciado**: Usando rem y em para consistencia

### 🚀 Migración Completada

- ✅ Separación de archivos CSS por componente
- ✅ Variables globales organizadas
- ✅ Responsividad mejorada
- ✅ Estructura escalable implementada
- ✅ Imports actualizados en componentes principales
- ✅ Archivos CSS no utilizados eliminados
- ✅ Estructura final limpia y organizada

### 🗑️ Archivos Eliminados

- ❌ `App.css` (original) - Reemplazado por `components/App.css`
- ❌ `variables.css` - Variables integradas en `base.css`
- ❌ `globals.css` - Contenido reorganizado en otros archivos
- ❌ `components/layout/` - Carpeta vacía eliminada