# � ProjectManagerMind IA - Frontend

Interfaz de usuario moderna y responsiva para el sistema inteligente de gestión de proyectos de software. Desarrollada con React + Vite para una experiencia de usuario fluida y eficiente.

## 🎯 ¿Qué es ProjectManagerMind IA?

**ProjectManagerMind IA** es un sistema integral que unifica la gestión de documentación, generación de entregables y apoyo a las decisiones mediante el uso de Inteligencia Artificial. Funciona como un cuaderno digital inteligente, diseñado para acompañar todo el ciclo de vida de un proyecto de software.

## 🚀 Características Principales

- **� Gestión Centralizada de Documentación**: Almacenamiento y clasificación por fases del ciclo de vida
- **� Generación Automática de Entregables**: Relevamiento, informes, diagramas y planificación
- **📊 Apoyo Inteligente a Decisiones**: Análisis de riesgos y recomendaciones con IA
- **🤖 Asistencia con IA Integrada**: Chat inteligente y automatización de documentación
- **� Metodologías Ágiles**: Soporte completo para Scrum y Kanban
- **📈 Análisis y Métricas**: Seguimiento de progreso y KPIs en tiempo real

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI con hooks modernos
- **Vite** - Herramienta de construcción rápida y eficiente
- **Axios** - Cliente HTTP para comunicación con API
- **CSS3** - Estilos modernos con variables CSS y flexbox
- **ESLint** - Linting y calidad de código

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── ChatPanel.jsx   # Panel de chat con IA
│   ├── SourcesPanel.jsx # Gestión de archivos y proyectos
│   ├── StudyPanel.jsx  # Visualización de resultados
│   ├── ProjectModal.jsx # Modal para crear/editar proyectos
│   ├── Upload.jsx      # Componente de subida de archivos
│   ├── ConnectionTest.jsx # Pruebas de conectividad
│   └── icons/          # Iconos SVG personalizados
├── services/           # Servicios de API organizados
│   ├── index.js        # Punto de entrada principal
│   ├── config.js       # Configuración de Axios
│   ├── projectService.js # Servicios de proyectos
│   ├── documentService.js # Servicios de documentos
│   ├── aiService.js    # Servicios de IA
│   └── systemService.js # Servicios del sistema
├── App.jsx            # Componente principal
├── App.css            # Estilos globales
└── main.jsx          # Punto de entrada de React
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Backend** de ProjectManagerMind IA ejecutándose en puerto 3000

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd ProjectManagerMind-IA/frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env (opcional)
   VITE_API_URL=http://localhost:3000
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la construcción de producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## 🌐 API y Servicios

El frontend se comunica con el backend a través de una arquitectura de servicios modular:

### Servicios Principales

- **ProjectService**: Gestión completa de proyectos
- **DocumentService**: Manejo de archivos y documentos
- **AIService**: Funcionalidades de inteligencia artificial
- **SystemService**: Estado del sistema y conectividad

### Ejemplo de Uso

```javascript
import { getProjects, createProject, uploadDocuments } from '../services';

// Obtener todos los proyectos
const projects = await getProjects();

// Crear un nuevo proyecto
const newProject = await createProject({
  name: 'Mi Proyecto',
  description: 'Descripción del proyecto'
});

// Subir documentos
const result = await uploadDocuments(formData, projectId);
```

## 🎨 Componentes Principales

### SourcesPanel
- Gestión de proyectos y archivos
- Subida de documentos con drag & drop
- Selección múltiple de archivos
- Creación de nuevos proyectos

### ChatPanel
- Chat inteligente con documentos
- Procesamiento en tiempo real
- Historial de conversaciones
- Indicadores de estado

### StudyPanel
- Visualización de resultados procesados
- Descarga de documentos generados
- Información del estado de IA
- Tabs organizados por tipo de contenido

## 🔍 Características Avanzadas

- **🔄 Actualización en Tiempo Real**: Los componentes se sincronizan automáticamente
- **⚡ Carga Optimizada**: Lazy loading y componentes optimizados
- **🛡️ Manejo de Errores**: Sistema robusto de captura y manejo de errores
- **📱 Responsivo**: Diseño adaptativo para todos los dispositivos
- **🎯 Accesibilidad**: Implementación de mejores prácticas de accesibilidad

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión con el backend**
   - Verificar que el backend esté ejecutándose en puerto 3000
   - Comprobar la configuración CORS del backend

2. **Archivos no se suben correctamente**
   - Verificar el tamaño de los archivos (límite configurado en backend)
   - Comprobar formatos soportados (PDF, DOC, DOCX)

3. **Chat no responde**
   - Verificar configuración de API de IA en el backend
   - Comprobar que hay documentos seleccionados

### Logs y Depuración

```bash
# Ver logs del servidor de desarrollo
npm run dev

# Verificar la consola del navegador para errores JavaScript
# Usar las herramientas de desarrollador del navegador
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**EduMMorenolp** - [GitHub](https://github.com/EduMMorenolp)

---

### 🔗 Enlaces Relacionados

- [Backend del Proyecto](../backend/README.md)
- [Documentación de API](../backend/documents/ENDPOINTS-DOCUMENTATION.md)
- [Guía de Activación](./GUIA-ACTIVACION.md)
