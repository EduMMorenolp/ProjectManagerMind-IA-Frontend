# Guía para activar la versión completa del Frontend con API

Para que el frontend sea completamente funcional con integración a la API, sigue estos pasos:

## 1. Activar los componentes con integración API

Reemplaza los componentes actuales por las versiones con integración API completa:

1. Reemplaza el archivo `SourcesPanel.jsx`:
   - Renombra el archivo `SourcesPanel_with_API.jsx` a `SourcesPanel.jsx` o copia su contenido

2. Reemplaza el archivo `ChatPanel.jsx`:
   - Renombra el archivo `ChatPanel_with_API.jsx` a `ChatPanel.jsx` o copia su contenido

3. Reemplaza el archivo `StudyPanel.jsx`:
   - Renombra el archivo `StudyPanel_corrected.jsx` a `StudyPanel.jsx` o copia su contenido

## 2. Actualizar los estilos CSS

1. Agrega los estilos del modal de carga:
   - Incluye el contenido de `upload-modal.css` en tu archivo `App.css` principal

## 3. Verificar las rutas de importación

1. Asegúrate de que todos los componentes estén importando los iconos desde `index.jsx`:
   ```jsx
   import { IconName } from './icons/index.jsx';
   ```

2. Verifica que los componentes estén importando el servicio API correctamente:
   ```jsx
   import { functionName } from '../services/api';
   ```

## 4. Iniciar los servidores

1. Asegúrate de que el backend esté ejecutándose en el puerto 3000:
   ```bash
   cd D:\Proyectos\Notebook-IA-Develop\backend
   npm run dev
   ```

2. Inicia el servidor de desarrollo del frontend:
   ```bash
   cd D:\Proyectos\Notebook-IA-Develop\frontend
   npm run dev
   ```

## 5. Verificar la conexión

1. Abre la consola del navegador para comprobar que no hay errores de conexión.
2. Selecciona algunos archivos en el panel de fuentes.
3. Intenta hacer una consulta en el panel de chat.
4. Verifica que los datos se muestren correctamente en el panel de estudio.

Si encuentras algún error:
- Asegúrate de que las rutas de API en `services/api.js` coincidan con las rutas definidas en el backend.
- Verifica que el backend esté configurado correctamente para aceptar peticiones CORS.
- Comprueba que la API de Gemini esté funcionando o que el fallback local esté configurado.

## Funcionalidades implementadas

1. **Panel de Fuentes**:
   - Lista de archivos disponibles (cargados desde la API)
   - Selección individual y múltiple de archivos
   - Modal para cargar nuevos documentos

2. **Panel de Chat**:
   - Sistema de mensajes con historial
   - Envío de consultas a la API
   - Visualización de mensajes del usuario y respuestas del sistema

3. **Panel de Estudio**:
   - Sistema de notas personales
   - Visualización de resúmenes de documentos
   - Detalles técnicos de los documentos seleccionados
   - Funcionalidad de descarga de documentos

## Nota sobre las APIs

Los componentes están diseñados para funcionar con estas APIs del backend:
- `/api/documents/upload` - Para subir nuevos documentos
- `/api/documents/process` - Para procesar consultas sobre documentos
- `/api/documents/projects` - Para obtener la lista de proyectos y documentos
- `/api/documents/{projectName}/{documentId}` - Para obtener detalles de un documento
- `/api/documents/{projectName}/{documentId}/download` - Para descargar un documento