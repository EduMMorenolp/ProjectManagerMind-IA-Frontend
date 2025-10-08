# Servicios de API - Estructura Modular

Esta carpeta contiene todos los servicios de API organizados de manera modular para facilitar el mantenimiento y la escalabilidad del proyecto.

## Estructura de Archivos

```
services/
├── config.js           # Configuración base de axios
├── index.js            # Punto de entrada principal con todas las exportaciones
├── systemService.js    # Servicios de información del sistema y salud
├── documentService.js  # Servicios de gestión de documentos
├── projectService.js   # Servicios de gestión de proyectos
├── aiService.js        # Servicios de funcionalidades de IA
└── README.md          # Este archivo
```

## Uso de los Servicios

### Importación Modular (Recomendado)

```javascript
// Importar servicios específicos
import { systemService, documentService, projectService, aiService } from '@/services';

// Usar un servicio específico
const healthStatus = await systemService.getHealthStatus();
const projects = await projectService.getProjects();
```

### Importación Individual

```javascript
// Importar funciones específicas
import { getHealthStatus, uploadDocuments, getProjects } from '@/services';

// Usar directamente
const health = await getHealthStatus();
const uploadResult = await uploadDocuments(formData);
```

### Importación Directa de index.js

```javascript
// Usar el punto de entrada principal
import { getHealthStatus, uploadDocuments, getProjects } from '@/services';
```

## Servicios Disponibles

### SystemService
- `getApiInfo()` - Información general de la API
- `getHealthStatus()` - Estado de salud del servidor

### DocumentService
- `uploadDocuments(formData)` - Subir documentos
- `workflowDocuments(formData)` - Ejecutar flujo completo
- `getDocumentTypes()` - Tipos de documentos disponibles
- `getDocument(projectName, documentId)` - Obtener documento específico
- `downloadDocument(projectName, documentId, format)` - Descargar documento

### ProjectService
- `getProjects()` - Obtener todos los proyectos
- `getProjectById(projectId)` - Obtener proyecto por ID
- `createProject(projectData)` - Crear nuevo proyecto
- `updateProject(projectId, projectData)` - Actualizar proyecto
- `deleteProject(projectId)` - Eliminar proyecto
- `getProjectDocuments(projectId)` - Documentos del proyecto
- `getProjectResults(projectId)` - Resultados procesados del proyecto

### AIService
- `processDocuments(data)` - Procesar documentos con IA
- `chatWithDocuments(chatData)` - Chat con documentos
- `testAI()` - Probar conexión con IA
- `getAIInfo()` - Información de IA
- `generateAnalysis(analysisData)` - Generar análisis personalizado
- `getAvailableModels()` - Modelos disponibles

## Beneficios de la Nueva Estructura

1. **Organización**: Cada servicio tiene su responsabilidad específica
2. **Mantenibilidad**: Fácil localizar y modificar funcionalidades
3. **Escalabilidad**: Agregar nuevos servicios sin afectar existentes
4. **Reutilización**: Importar solo lo que necesitas
5. **Compatibilidad**: El código existente sigue funcionando
6. **Testing**: Fácil hacer pruebas unitarias por servicio

## Migración Gradual

Para migrar código existente a la nueva estructura:

1. **Paso 1**: Usar importaciones modulares organizadas
   ```javascript
   // Importación modular (recomendado)
   import { projectService } from '@/services';
   const projects = await projectService.getProjects();
   
   // O importación directa
   import { getProjects } from '@/services';
   const projects = await getProjects();
   ```

2. **Paso 2**: Usar los servicios organizados
   ```javascript
   // Groupar llamadas relacionadas
   const { getProjects, createProject } = projectService;
   ```

3. **Paso 3**: Aprovechar las nuevas funcionalidades
   ```javascript
   // Usar nuevos métodos como getProjectById, updateProject, etc.
   ```

## Extensibilidad

Para agregar nuevos servicios:

1. Crear archivo `nuevoService.js` en la carpeta services
2. Implementar las funciones necesarias
3. Exportar desde `index.js`
4. Documentar en este README

Ejemplo:
```javascript
// userService.js
import api from './config.js';

export const getUsers = async () => {
  // implementación
};

// index.js
export * as userService from './userService.js';
```