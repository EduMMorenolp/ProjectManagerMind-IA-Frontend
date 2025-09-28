# Categorización de Documentos por Etapas

## 📋 Resumen de Cambios

Se ha implementado un sistema de categorización de documentos por etapas del proyecto, organizando los documentos según las siguientes etapas:

### 🔄 Etapas del Proyecto

#### **Etapa Preliminar**
- 👤 **Cliente** - Información del cliente y requerimientos
- 📋 **Relevamiento** - Análisis y recopilación de información  
- 📄 **Informe** - Informe ejecutivo del relevamiento

#### **Etapa de Análisis**
- 🎯 **Objetivos** - Objetivos del sistema informático
- 🔄 **Diagramas de Flujo** - Diagramas de flujo de datos (DFD)
- 📖 **Historias de Usuario** - Historias de usuario y metodologías ágiles

#### **Etapa de Diseño**
- ⚡ **Sprints** - Planificación de sprints SCRUM
- 🗄️ **DER** - Diagrama Entidad-Relación
- ⚙️ **Casos de Uso** - Casos de uso del sistema

## 🛠️ Implementación Técnica

### Modificaciones en `SourcesPanel.jsx`

1. **Constantes de Tipos de Documentos**: Se agregó `DOCUMENT_TYPES` con la estructura completa de etapas y tipos.

2. **Estados Adicionales**:
   - `selectedDocumentType`: Tipo de documento seleccionado
   - `selectedStage`: Etapa seleccionada

3. **Funciones Nuevas**:
   - `getAllDocumentTypes()`: Obtiene todos los tipos disponibles
   - `organizeFilesByStageAndType()`: Organiza archivos por etapa y tipo

4. **Modal de Upload Mejorado**:
   - Selector de etapa del proyecto
   - Selector de tipo de documento específico
   - Validación requerida antes de subir

5. **Vista Organizada**:
   - Archivos agrupados por etapa
   - Subsecciones por tipo de documento
   - Contadores visuales por tipo
   - Indicadores visuales con iconos

### Campos de Base de Datos

Los documentos ahora incluyen:
- `documentType`: Tipo específico (cliente, relevamiento, etc.)
- `stage`: Etapa del proyecto (preliminar, analisis, diseno)

### Interfaz de Usuario

- **Navegación jerárquica**: Etapa → Tipo → Documentos
- **Contadores visuales**: Número de documentos por tipo
- **Iconos descriptivos**: Cada tipo tiene su emoji identificativo
- **Colores distintivos**: Estados activos/inactivos claramente diferenciados

## 🎯 Beneficios

1. **Organización Mejorada**: Los documentos están categorizados lógicamente
2. **Mejor UX**: Fácil localización de documentos específicos
3. **Flujo de Trabajo Claro**: Seguimiento natural de las etapas del proyecto
4. **Escalabilidad**: Fácil agregar nuevos tipos o etapas
5. **Consistencia**: Estructura uniforme en toda la aplicación

## 🔄 Flujo de Upload

1. Usuario selecciona "Subir documento"
2. Elige la etapa del proyecto
3. Selecciona el tipo específico de documento
4. Carga el archivo
5. El documento se clasifica automáticamente en su categoría

## 🎨 Estilos Implementados

- Títulos de etapa con subrayado distintivo
- Headers de tipo con iconos y contadores
- Indentación visual para jerarquía
- Colores adaptativos según contenido
- Responsive design mantenido

Este sistema proporciona una base sólida para la gestión de documentos organizados por metodología de desarrollo de proyectos.