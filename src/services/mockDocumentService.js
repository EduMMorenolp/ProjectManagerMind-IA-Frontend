/**
 * Servicio Mock para gestión de documentos
 * Simula la funcionalidad de documentos completamente en el frontend
 */

import mockProjectService from './mockProjectService.js';

class MockDocumentService {
  constructor() {
    this.projectService = mockProjectService;
  }

  async simulateDelay() {
    return this.projectService.simulateDelay();
  }

  // Subir documentos
  async uploadDocuments(projectId, files, stage = 'PRELIMINAR', type = 'CLIENTE') {
    await this.simulateDelay();
    
    const uploadedDocuments = [];
    
    for (const file of files) {
      const document = await this.projectService.uploadDocument(projectId, file, { stage, type });
      uploadedDocuments.push(document.data);
    }

    return {
      success: true,
      data: uploadedDocuments,
      message: `${uploadedDocuments.length} documento(s) subido(s) exitosamente`
    };
  }

  // Obtener documentos de un proyecto
  async getProjectDocuments(projectId, filters = {}) {
    return this.projectService.getProjectDocuments(projectId, filters);
  }

  // Obtener documento por ID
  async getDocumentById(documentId) {
    await this.simulateDelay();
    
    const documents = this.projectService.getAllDocuments();
    const document = documents.find(d => d.id === documentId.toString());
    
    if (!document) {
      throw new Error(`Documento con ID ${documentId} no encontrado`);
    }

    return {
      success: true,
      data: document
    };
  }

  // Eliminar documento
  async deleteDocument(documentId) {
    return this.projectService.deleteDocument(documentId);
  }

  // Procesar documentos con IA (mock)
  async processDocuments(projectId, documentIds, documentTypes = ['RELEVAMIENTO']) {
    await this.simulateDelay();
    
    const documents = this.projectService.getAllDocuments();
    const targetDocuments = documents.filter(d => 
      d.projectId === projectId.toString() && 
      documentIds.includes(d.id)
    );

    if (targetDocuments.length === 0) {
      throw new Error('No se encontraron documentos para procesar');
    }

    const processedResults = [];
    
    for (const docType of documentTypes) {
      // Simular procesamiento con IA
      const mockContent = this.generateMockProcessedContent(docType, targetDocuments);
      
      const result = await this.projectService.saveProcessedResult(projectId, {
        type: docType,
        stage: this.getStageForDocumentType(docType),
        content: mockContent,
        metadata: {
          sourceDocuments: targetDocuments.map(d => d.id),
          processedAt: new Date().toISOString(),
          aiProvider: 'mock',
          processingTime: Math.floor(Math.random() * 5000) + 1000
        }
      });
      
      processedResults.push(result.data);
    }

    return {
      success: true,
      data: processedResults,
      message: `${processedResults.length} documento(s) procesado(s) exitosamente`
    };
  }

  // Generar contenido mock procesado
  generateMockProcessedContent(type, sourceDocuments) {
    const sourceInfo = sourceDocuments.map(d => d.filename).join(', ');
    
    switch (type) {
      case 'CLIENTE':
        return this.generateClienteContent(sourceInfo);
      case 'RELEVAMIENTO':
        return this.generateRelevamientoContent(sourceInfo);
      case 'INFORME':
        return this.generateInformeContent(sourceInfo);
      case 'OBJETIVOS':
        return this.generateObjetivosContent(sourceInfo);
      default:
        return this.generateDefaultContent(type, sourceInfo);
    }
  }

  generateClienteContent(sourceInfo) {
    const empresas = ['TechCorp SRL', 'InnovaSoft SA', 'DataSystems Ltda', 'CloudTech Inc', 'SmartBiz Co'];
    const sectores = ['Retail', 'Salud', 'Educación', 'Finanzas', 'Manufactura'];
    const empresa = empresas[Math.floor(Math.random() * empresas.length)];
    const sector = sectores[Math.floor(Math.random() * sectores.length)];

    return `# Información del Cliente - ${empresa}

## Datos de la Empresa
- **Razón Social:** ${empresa}
- **Sector:** ${sector}
- **Tamaño:** Empresa mediana (50-200 empleados)
- **Ubicación:** Buenos Aires, Argentina

## Contacto Principal
- **Nombre:** Juan Carlos Martínez
- **Cargo:** Director de IT
- **Email:** jmartinez@${empresa.toLowerCase().replace(/\s+/g, '')}.com
- **Teléfono:** +54 11 4555-1234

## Necesidades del Negocio
El cliente requiere una solución tecnológica que permita:
- Automatizar procesos operativos actuales
- Mejorar la experiencia del usuario final
- Integrar sistemas existentes
- Escalar según el crecimiento del negocio

## Contexto Tecnológico Actual
- **ERP:** SAP Business One
- **CRM:** Salesforce
- **Base de Datos:** PostgreSQL
- **Infraestructura:** Cloud híbrida (AWS + On-premise)

## Presupuesto Estimado
- **Rango:** USD 50,000 - 100,000
- **Plazo:** 6-8 meses
- **Recursos:** Equipo de 4-6 desarrolladores

*Información extraída de: ${sourceInfo}*`;
  }

  generateRelevamientoContent(sourceInfo) {
    return `# Relevamiento Técnico del Proyecto

## Resumen Ejecutivo
Basado en el análisis de los documentos proporcionados, se identifica la necesidad de desarrollar una solución integral que mejore los procesos operativos del cliente.

## Análisis de Requerimientos

### Requerimientos Funcionales
1. **Gestión de Usuarios**
   - Autenticación y autorización
   - Perfiles de usuario diferenciados
   - Gestión de permisos granular

2. **Procesamiento de Datos**
   - Importación masiva de información
   - Validación automática de datos
   - Generación de reportes personalizados

3. **Integración de Sistemas**
   - API REST para integración con sistemas existentes
   - Sincronización de datos en tiempo real
   - Manejo de webhooks para notificaciones

### Requerimientos No Funcionales
1. **Performance**
   - Tiempo de respuesta < 2 segundos
   - Soporte para 1000+ usuarios concurrentes
   - Disponibilidad 99.9%

2. **Seguridad**
   - Encriptación de datos sensibles
   - Auditoría de accesos
   - Cumplimiento GDPR

3. **Escalabilidad**
   - Arquitectura basada en microservicios
   - Auto-scaling en la nube
   - Load balancing automático

## Arquitectura Propuesta

### Stack Tecnológico
- **Frontend:** React.js + TypeScript
- **Backend:** Node.js + Express
- **Base de Datos:** PostgreSQL + Redis (cache)
- **Deployment:** Docker + Kubernetes
- **Cloud:** AWS/Azure

### Componentes del Sistema
1. **API Gateway:** Manejo centralizado de requests
2. **Servicio de Autenticación:** JWT + OAuth 2.0
3. **Microservicios de Negocio:** Lógica específica por dominio
4. **Base de Datos:** Esquema normalizado con índices optimizados
5. **Sistema de Cache:** Redis para performance
6. **Queue System:** Para procesamiento asíncrono

## Estimación de Esfuerzo

### Fases del Proyecto
1. **Fase 1 - Setup y Arquitectura** (3 semanas)
2. **Fase 2 - Core Development** (12 semanas)
3. **Fase 3 - Testing y QA** (4 semanas)
4. **Fase 4 - Deployment y Go-Live** (2 semanas)

### Recursos Necesarios
- **Tech Lead:** 1 persona (full-time)
- **Senior Developers:** 2 personas (full-time)
- **Junior Developers:** 2 personas (full-time)
- **QA Engineer:** 1 persona (part-time)
- **DevOps Engineer:** 1 persona (part-time)

## Riesgos Identificados
1. **Integración Compleja:** Sistemas legacy pueden requerir adaptaciones
2. **Migración de Datos:** Validación y limpieza de información existente
3. **Cambios de Scope:** Requerimientos adicionales durante desarrollo

## Próximos Pasos
1. Validación de requerimientos con stakeholders
2. Definición detallada de APIs
3. Prototipo de arquitectura
4. Plan de testing detallado

*Análisis basado en: ${sourceInfo}*`;
  }

  generateInformeContent(sourceInfo) {
    return `# Informe Ejecutivo - Propuesta de Desarrollo

## Resumen del Proyecto
Tras el análisis exhaustivo de los requerimientos del cliente, se presenta la propuesta integral para el desarrollo de la solución tecnológica solicitada.

## Objetivos del Proyecto

### Objetivo Principal
Desarrollar una plataforma tecnológica robusta que automatice los procesos operativos del cliente, mejorando la eficiencia y reduciendo los costos operativos en un 30%.

### Objetivos Específicos
- Implementar sistema de gestión integral
- Automatizar flujos de trabajo manuales
- Integrar sistemas existentes
- Mejorar experiencia del usuario final
- Establecer base para crecimiento futuro

## Propuesta de Solución

### Características Principales
1. **Dashboard Ejecutivo**
   - Métricas en tiempo real
   - KPIs personalizables
   - Alertas automáticas
   - Reportes programados

2. **Gestión de Procesos**
   - Workflow automatizado
   - Aprobaciones digitales
   - Trazabilidad completa
   - Notificaciones inteligentes

3. **Integración Empresarial**
   - Conectores pre-construidos
   - APIs personalizadas
   - Sincronización bidireccional
   - Mapeo de datos flexible

### Beneficios Esperados
- **Eficiencia Operativa:** Reducción del 40% en tiempo de procesamiento
- **Reducción de Errores:** 85% menos errores manuales
- **Visibilidad:** 100% trazabilidad de procesos
- **ROI:** Retorno de inversión en 18 meses

## Análisis Financiero

### Inversión Requerida
| Concepto | Costo (USD) |
|----------|-------------|
| Desarrollo | 75,000 |
| Infraestructura | 15,000 |
| Testing & QA | 10,000 |
| **Total** | **100,000** |

### Costos Operativos Anuales
- **Hosting y Mantenimiento:** USD 12,000/año
- **Soporte Técnico:** USD 18,000/año
- **Actualizaciones:** USD 8,000/año
- **Total Anual:** USD 38,000/año

## Cronograma de Implementación

### Hitos Principales
1. **Mes 1:** Diseño y arquitectura
2. **Mes 2-4:** Desarrollo core
3. **Mes 5:** Integraciones
4. **Mes 6:** Testing y deployment
5. **Mes 7:** Go-live y capacitación
6. **Mes 8:** Estabilización y optimización

### Entregables por Fase
- **Documentación técnica**
- **Prototipos funcionales**
- **Código fuente**
- **Plan de testing**
- **Manual de usuario**
- **Plan de capacitación**

## Gestión de Riesgos

### Riesgos Técnicos
- **Complejidad de integración:** MEDIO - Mitigado con pruebas tempranas
- **Performance:** BAJO - Arquitectura escalable
- **Seguridad:** BAJO - Mejores prácticas implementadas

### Riesgos del Proyecto
- **Cambio de requerimientos:** ALTO - Control de cambios estricto
- **Disponibilidad del cliente:** MEDIO - Comunicación proactiva
- **Recursos técnicos:** BAJO - Equipo experimentado

## Conclusiones y Recomendaciones
La propuesta presentada ofrece una solución integral y escalable que cumple con todos los requerimientos identificados. Se recomienda proceder con la implementación según el cronograma propuesto para maximizar los beneficios del proyecto.

### Próximos Pasos
1. Aprobación de la propuesta
2. Firma del contrato
3. Kick-off del proyecto
4. Inicio de la fase de diseño

*Informe basado en: ${sourceInfo}*`;
  }

  generateObjetivosContent(sourceInfo) {
    return `# Objetivos y Planificación del Proyecto

## Objetivos Estratégicos

### Objetivo Principal
**Transformación Digital Integral:** Desarrollar e implementar una solución tecnológica que revolucione los procesos operativos del cliente, estableciendo las bases para el crecimiento sostenible y la innovación continua.

### Objetivos Específicos Medibles

#### 1. Eficiencia Operativa
- **Meta:** Reducir en 45% el tiempo de procesamiento de operaciones
- **KPI:** Tiempo promedio por transacción
- **Plazo:** 6 meses post-implementación

#### 2. Calidad de Datos
- **Meta:** Alcanzar 99.5% de precisión en datos procesados
- **KPI:** Tasa de errores por transacción
- **Plazo:** 3 meses post-implementación

#### 3. Satisfacción del Usuario
- **Meta:** Lograr 90% de satisfacción en encuestas de usuario
- **KPI:** Net Promoter Score (NPS)
- **Plazo:** 4 meses post-implementación

#### 4. ROI del Proyecto
- **Meta:** Recuperar inversión en 18 meses
- **KPI:** Ahorro de costos vs inversión realizada
- **Plazo:** 18 meses

## Planificación Detallada

### Sprint 1 - Fundación (Semanas 1-3)
**Objetivos:**
- Establecer arquitectura base
- Configurar entorno de desarrollo
- Definir estándares de código

**Entregables:**
- Documentación de arquitectura
- Repositorio de código configurado
- Pipeline CI/CD básico
- Prototipo de login

### Sprint 2 - Core Backend (Semanas 4-6)
**Objetivos:**
- Implementar APIs fundamentales
- Configurar base de datos
- Sistema de autenticación

**Entregables:**
- API de usuarios
- API de autenticación
- Esquema de base de datos
- Documentación de APIs

### Sprint 3 - Frontend Base (Semanas 7-9)
**Objetivos:**
- Interfaz de usuario principal
- Integración con backend
- Navegación básica

**Entregables:**
- Dashboard principal
- Sistema de login funcional
- Navegación entre módulos
- Responsive design base

### Sprint 4 - Funcionalidades Core (Semanas 10-12)
**Objetivos:**
- Módulos principales del negocio
- Procesamiento de datos
- Validaciones

**Entregables:**
- Módulo de gestión principal
- Sistema de validaciones
- Reportes básicos
- Manejo de errores

### Sprint 5 - Integraciones (Semanas 13-15)
**Objetivos:**
- Conectar con sistemas existentes
- APIs de terceros
- Migración de datos

**Entregables:**
- Conectores con sistemas legacy
- APIs de integración
- Herramienta de migración
- Validación de datos

### Sprint 6 - Testing y Optimización (Semanas 16-18)
**Objetivos:**
- Testing exhaustivo
- Optimización de performance
- Corrección de bugs

**Entregables:**
- Suite de tests automatizados
- Reporte de performance
- Documentación de bugs corregidos
- Plan de deployment

### Sprint 7 - Deployment y Go-Live (Semanas 19-21)
**Objetivos:**
- Despliegue en producción
- Capacitación de usuarios
- Monitoreo inicial

**Entregables:**
- Sistema en producción
- Manual de usuario
- Sesiones de capacitación
- Plan de soporte

## Métricas de Éxito

### Métricas Técnicas
- **Uptime:** 99.9%
- **Response Time:** < 2 segundos promedio
- **Error Rate:** < 0.1%
- **Performance Score:** > 90/100

### Métricas de Negocio
- **Adopción de Usuarios:** > 95% en 3 meses
- **Transacciones Procesadas:** +200% vs sistema actual
- **Ahorro de Tiempo:** 40% reducción en tareas manuales
- **Costo por Transacción:** 50% reducción

### Métricas de Calidad
- **Code Coverage:** > 80%
- **Bug Density:** < 2 bugs por KLOC
- **Customer Satisfaction:** > 4.5/5
- **Team Velocity:** Consistente ±10%

## Gestión de Riesgos y Contingencias

### Plan de Contingencia - Retrasos
- **Riesgo:** Retraso en desarrollo
- **Impacto:** ALTO
- **Mitigación:** Equipo de refuerzo disponible
- **Contingencia:** Priorización de features críticas

### Plan de Contingencia - Integración
- **Riesgo:** Problemas de integración con sistemas legacy
- **Impacto:** MEDIO
- **Mitigación:** Testing temprano de conectores
- **Contingencia:** Desarrollo de adapters adicionales

### Plan de Contingencia - Performance
- **Riesgo:** No cumplir métricas de performance
- **Impacto:** MEDIO
- **Mitigación:** Pruebas de carga continuas
- **Contingencia:** Optimización arquitectural

## Recursos y Responsabilidades

### Equipo del Proyecto
- **Project Manager:** Coordinación general y seguimiento
- **Tech Lead:** Arquitectura y decisiones técnicas
- **Senior Developers (2):** Desarrollo de módulos críticos
- **Junior Developers (2):** Desarrollo de componentes
- **QA Engineer:** Testing y calidad
- **DevOps Engineer:** Infraestructura y deployment

### Cliente - Responsabilidades
- **Product Owner:** Definición de requerimientos
- **Business Analysts:** Validación de procesos
- **IT Team:** Soporte en integraciones
- **End Users:** Testing de aceptación

## Conclusión
Este plan de objetivos establece un marco claro y medible para el éxito del proyecto, con hitos específicos, métricas de seguimiento y planes de contingencia que aseguran la entrega exitosa de la solución.

*Planificación basada en: ${sourceInfo}*`;
  }

  generateDefaultContent(type, sourceInfo) {
    return `# Documento ${type}

## Contenido Generado Automáticamente
Este documento ha sido procesado automáticamente por el sistema de IA mock.

### Información del Procesamiento
- **Tipo de Documento:** ${type}
- **Fecha de Procesamiento:** ${new Date().toLocaleString()}
- **Archivos Fuente:** ${sourceInfo}

### Contenido Mock
Este es contenido de ejemplo generado para demostrar el funcionamiento del sistema en modo de prueba. En un entorno de producción, aquí aparecería el contenido real procesado por la IA.

### Características Simuladas
- Análisis automático de documentos
- Extracción de información relevante
- Generación de resúmenes ejecutivos
- Identificación de puntos clave
- Recomendaciones estratégicas

*Contenido generado en modo Test IA para propósitos de demostración.*`;
  }

  // Obtener etapa para tipo de documento
  getStageForDocumentType(type) {
    const stageMapping = {
      'CLIENTE': 'PRELIMINAR',
      'RELEVAMIENTO': 'PRELIMINAR', 
      'INFORME': 'ANALISIS',
      'OBJETIVOS': 'DISENO'
    };
    return stageMapping[type] || 'PRELIMINAR';
  }

  // Workflow completo: subir y procesar
  async uploadAndProcess(projectId, files, stage, documentTypes) {
    await this.simulateDelay();
    
    // 1. Subir documentos
    const uploadResult = await this.uploadDocuments(projectId, files, stage, 'CLIENTE');
    const uploadedDocs = uploadResult.data;
    
    // 2. Procesar documentos
    const documentIds = uploadedDocs.map(d => d.id);
    const processResult = await this.processDocuments(projectId, documentIds, documentTypes);
    
    return {
      success: true,
      data: {
        uploadedDocuments: uploadedDocs,
        processedResults: processResult.data
      },
      message: `Workflow completado: ${uploadedDocs.length} documento(s) subido(s) y ${processResult.data.length} resultado(s) procesado(s)`
    };
  }
}

// Singleton instance
const mockDocumentService = new MockDocumentService();

export default mockDocumentService;