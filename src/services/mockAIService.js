/**
 * Servicio Mock para IA - Genera documentos de prueba
 * Simula el comportamiento de la IA real para testing
 */

import { MOCK_SPEEDS } from '../constants/aiProviders.js';

class MockAIService {
  constructor() {
    this.projectCounter = 1;
    this.documentCounter = 1;
  }

  // Simular delay de procesamiento
  async simulateDelay(speed = 'normal') {
    const delay = MOCK_SPEEDS[speed]?.delay || MOCK_SPEEDS.normal.delay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Generar proyecto mock
  generateMockProject(name) {
    return {
      id: `mock-project-${this.projectCounter++}`,
      name: name || `Proyecto Mock ${this.projectCounter}`,
      description: `Proyecto de prueba generado automáticamente para testing del sistema`,
      clientName: `Cliente Mock ${this.projectCounter}`,
      startDate: new Date().toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { documents: 0, processedResults: 0 }
    };
  }

  // Generar documento CLIENTE mock
  generateClienteDocument(projectId, projectName) {
    const empresas = ['TechCorp SRL', 'InnovaSoft SA', 'DataSystems Ltda', 'CloudTech Inc', 'SmartBiz Co'];
    const sectores = ['Retail', 'Salud', 'Educación', 'Finanzas', 'Manufactura'];
    const empresa = empresas[Math.floor(Math.random() * empresas.length)];
    const sector = sectores[Math.floor(Math.random() * sectores.length)];

    const content = `# Información del Cliente - ${empresa}

## Datos de la Empresa
- **Razón Social:** ${empresa}
- **Sector:** ${sector}
- **Tamaño:** Empresa mediana (50-200 empleados)
- **Ubicación:** Buenos Aires, Argentina

## Contacto Principal
- **Nombre:** Juan Carlos Pérez
- **Cargo:** Gerente de Sistemas
- **Email:** jperez@${empresa.toLowerCase().replace(/\s+/g, '')}.com
- **Teléfono:** +54 11 4567-8900

## Contexto del Negocio
${empresa} es una empresa del sector ${sector.toLowerCase()} que busca modernizar sus procesos operativos mediante la implementación de un sistema informático integral.

### Objetivos Principales
1. **Automatización de Procesos:** Reducir tareas manuales en un 70%
2. **Integración de Datos:** Centralizar información dispersa en múltiples sistemas
3. **Mejora de Reportes:** Generar reportes automáticos y dashboards en tiempo real
4. **Escalabilidad:** Sistema que crezca con la empresa

### Situación Actual
- Utilizan planillas Excel para la mayoría de procesos
- Sistemas legacy desconectados entre sí
- Falta de trazabilidad en los procesos
- Reportes manuales que consumen mucho tiempo

### Expectativas del Proyecto
- Implementación en 6 meses
- Capacitación del personal incluida
- Soporte técnico post-implementación
- ROI esperado: 25% en el primer año

## Stakeholders Clave
1. **Juan Carlos Pérez** - Gerente de Sistemas (Sponsor)
2. **María López** - Jefa de Operaciones (Usuario Clave)
3. **Carlos Rodríguez** - Contador General (Usuario Final)
4. **Ana Martínez** - Recursos Humanos (Usuario Final)

## Restricciones y Consideraciones
- Presupuesto: USD $50,000 - $75,000
- No puede haber downtime durante horario laboral
- Debe integrarse con sistema contable existente (Tango)
- Requisitos de seguridad estándar del sector

---
*Documento generado por Test IA Mock el ${new Date().toLocaleString('es-ES')}*`;

    return {
      id: `mock-doc-${this.documentCounter++}`,
      fileName: `${projectName}_cliente_info.md`,
      fileType: 'text/markdown',
      content: content,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      projectId: projectId,
      stage: 'PRELIMINAR',
      documentType: 'CLIENTE',
      source: 'GENERATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        empresa: empresa,
        sector: sector,
        generatedBy: 'mock-ai',
        mockData: true
      }
    };
  }

  // Generar documento RELEVAMIENTO mock
  generateRelevamientoDocument(projectId, projectName, clienteInfo = {}) {
    const content = `# Relevamiento Técnico - ${projectName}

## Resumen Ejecutivo
Este documento presenta el relevamiento técnico realizado para ${clienteInfo.empresa || 'la empresa cliente'}, con el objetivo de modernizar sus procesos operativos mediante la implementación de un sistema informático integral.

## Metodología de Relevamiento
- **Entrevistas:** 15 entrevistas con stakeholders clave
- **Observación directa:** 40 horas de observación de procesos
- **Análisis documental:** Revisión de 25 documentos existentes
- **Mapeo de procesos:** Identificación de 12 procesos críticos

## Situación Actual

### Sistemas Existentes
1. **Sistema Contable:** Tango Gestión
   - Estado: Operativo pero desactualizado
   - Usuarios: 5 personas
   - Problemas: Falta integración con otros sistemas

2. **Gestión de Inventario:** Planillas Excel
   - Estado: Manual y propenso a errores
   - Usuarios: 8 personas
   - Problemas: Duplicación de datos, falta de trazabilidad

3. **Gestión de Clientes:** Sistema propietario básico
   - Estado: Funcional pero limitado
   - Usuarios: 12 personas
   - Problemas: No integra con ventas ni contabilidad

### Procesos Identificados
1. **Gestión de Pedidos**
   - Tiempo promedio: 45 minutos por pedido
   - Involucra: 4 departamentos
   - Pain points: Comunicación manual, errores de transcripción

2. **Control de Inventario**
   - Frecuencia: Semanal (debería ser diaria)
   - Método: Manual con planillas
   - Pain points: Desactualización, falta de alertas

3. **Facturación**
   - Tiempo promedio: 30 minutos por factura
   - Integración: Parcial con sistema contable
   - Pain points: Doble carga de datos

4. **Reportes Gerenciales**
   - Frecuencia: Mensual
   - Tiempo de preparación: 2 días completos
   - Pain points: Datos desactualizados, proceso manual

## Arquitectura Tecnológica Actual

### Hardware
- **Servidores:** 2 servidores físicos (5 años de antigüedad)
- **Estaciones de trabajo:** 25 PCs Windows 10/11
- **Red:** Ethernet 100Mbps (requiere upgrade)
- **Backup:** Sistema básico semanal

### Software
- **Sistema Operativo:** Windows Server 2016
- **Base de Datos:** SQL Server 2014 Express
- **Office:** Microsoft 365 Business
- **Antivirus:** Windows Defender + Kaspersky

### Infraestructura de Red
- **Topología:** Estrella centralizada
- **Ancho de banda:** 50Mbps simétrico
- **WiFi:** Cobertura parcial del edificio
- **Seguridad:** Firewall básico, sin VPN

## Análisis de Requerimientos

### Requerimientos Funcionales
1. **Gestión de Clientes**
   - CRUD completo de clientes
   - Historial de interacciones
   - Segmentación automática

2. **Gestión de Productos/Servicios**
   - Catálogo centralizado
   - Control de stock en tiempo real
   - Alertas de stock mínimo

3. **Procesamiento de Pedidos**
   - Workflow automatizado
   - Integración con inventario
   - Notificaciones automáticas

4. **Facturación Electrónica**
   - Generación automática
   - Integración con AFIP
   - Envío por email

5. **Reportes y Analytics**
   - Dashboard gerencial
   - Reportes automáticos
   - KPIs en tiempo real

### Requerimientos No Funcionales
1. **Performance**
   - Tiempo de respuesta < 3 segundos
   - Soporte para 30 usuarios concurrentes
   - Disponibilidad 99.5%

2. **Seguridad**
   - Autenticación por roles
   - Cifrado de datos sensibles
   - Logs de auditoría

3. **Usabilidad**
   - Interfaz intuitiva
   - Capacitación mínima requerida
   - Responsive design

## Recomendaciones Técnicas

### Arquitectura Propuesta
- **Frontend:** React con Material-UI
- **Backend:** Node.js con Express
- **Base de Datos:** PostgreSQL
- **Hosting:** Cloud híbrido (AWS/Azure)

### Plan de Migración
1. **Fase 1:** Infraestructura base (4 semanas)
2. **Fase 2:** Módulo de clientes (6 semanas)
3. **Fase 3:** Inventario y productos (6 semanas)
4. **Fase 4:** Procesamiento de pedidos (8 semanas)
5. **Fase 5:** Facturación e integración (6 semanas)

### Estimación de Costos
- **Desarrollo:** $45,000 - $60,000
- **Infraestructura:** $8,000 - $12,000
- **Capacitación:** $3,000 - $5,000
- **Soporte primer año:** $6,000 - $10,000

## Riesgos Identificados
1. **Resistencia al cambio:** Alto - Plan de gestión del cambio requerido
2. **Integración con Tango:** Medio - Requiere desarrollo específico
3. **Migración de datos:** Medio - Datos inconsistentes en planillas
4. **Capacitación:** Bajo - Personal técnicamente capaz

## Próximos Pasos
1. Aprobación del relevamiento por stakeholders
2. Definición detallada de objetivos del proyecto
3. Elaboración de historias de usuario
4. Diseño de la arquitectura del sistema
5. Planificación detallada del proyecto

---
*Relevamiento realizado por Test IA Mock el ${new Date().toLocaleString('es-ES')}*
*Próxima actualización: En fase de análisis*`;

    return {
      id: `mock-doc-${this.documentCounter++}`,
      fileName: `${projectName}_relevamiento.md`,
      fileType: 'text/markdown',
      content: content,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      projectId: projectId,
      stage: 'PRELIMINAR',
      documentType: 'RELEVAMIENTO',
      source: 'GENERATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        processesIdentified: 12,
        interviewsCompleted: 15,
        systemsAnalyzed: 3,
        generatedBy: 'mock-ai',
        mockData: true
      }
    };
  }

  // Generar documento INFORME mock
  generateInformeDocument(projectId, projectName) {
    const content = `# Informe Ejecutivo - ${projectName}

## Resumen Ejecutivo
Este informe presenta las conclusiones del relevamiento técnico realizado y establece las bases para el desarrollo del sistema informático solicitado.

### Hallazgos Principales
- **Oportunidad de automatización:** 70% de procesos pueden ser automatizados
- **ROI estimado:** 25-30% en el primer año
- **Tiempo de implementación:** 6-8 meses
- **Inversión requerida:** $60,000 - $75,000

## Análisis de la Situación Actual
El relevamiento reveló una empresa con procesos bien definidos pero altamente manuales. Los principales hallazgos incluyen:

### Fortalezas Identificadas
- ✅ Procesos de negocio bien estructurados
- ✅ Personal capacitado y comprometido
- ✅ Infraestructura tecnológica básica funcional
- ✅ Apoyo gerencial para la modernización

### Oportunidades de Mejora
- 🔄 Automatización de procesos manuales
- 🔄 Integración de sistemas desconectados
- 🔄 Centralización de información
- 🔄 Reportes en tiempo real

### Desafíos a Considerar
- ⚠️ Resistencia potencial al cambio
- ⚠️ Migración de datos legacy
- ⚠️ Capacitación del personal
- ⚠️ Integración con sistemas existentes

## Propuesta de Solución

### Visión del Sistema
Desarrollar una plataforma integral que unifique todos los procesos operativos de la empresa, proporcionando:
- Gestión centralizada de clientes
- Control de inventario en tiempo real
- Automatización del proceso de pedidos
- Facturación electrónica integrada
- Dashboard gerencial con KPIs

### Arquitectura Recomendada
**Componentes principales:**
- Frontend: React con Material-UI
- Backend: Node.js con Express
- Base de Datos: PostgreSQL
- Integraciones: Tango, AFIP

### Módulos Principales
1. **Gestión de Clientes (CRM)**
   - Base de datos unificada de clientes
   - Historial de interacciones
   - Segmentación automática

2. **Gestión de Inventario**
   - Control de stock en tiempo real
   - Alertas automáticas
   - Trazabilidad completa

3. **Procesamiento de Pedidos**
   - Workflow automatizado
   - Validaciones automáticas
   - Notificaciones por email/SMS

4. **Facturación Electrónica**
   - Generación automática
   - Integración con AFIP
   - Envío automático a clientes

5. **Reportes y Analytics**
   - Dashboard ejecutivo
   - KPIs en tiempo real
   - Reportes automáticos programados

## Plan de Implementación

### Fases del Proyecto
| Fase | Descripción | Duración | Entregables |
|------|-------------|----------|-------------|
| 1 | Análisis y Diseño | 4 semanas | Objetivos, Historias de Usuario, Mockups |
| 2 | Infraestructura Base | 3 semanas | Servidor, BD, Arquitectura |
| 3 | Módulo CRM | 6 semanas | Gestión de clientes funcional |
| 4 | Inventario | 6 semanas | Control de stock completo |
| 5 | Pedidos | 8 semanas | Workflow automatizado |
| 6 | Facturación | 6 semanas | Integración AFIP completa |
| 7 | Testing y Deploy | 4 semanas | Sistema en producción |

### Cronograma General
- **Inicio:** ${new Date().toLocaleDateString('es-ES')}
- **Finalización estimada:** ${new Date(Date.now() + 32 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
- **Duración total:** 32 semanas (8 meses)

## Análisis Financiero

### Inversión Inicial
| Concepto | Costo |
|----------|-------|
| Desarrollo del sistema | $50,000 |
| Infraestructura (primer año) | $12,000 |
| Capacitación | $4,000 |
| **Total** | **$66,000** |

### Beneficios Esperados (Anuales)
- Reducción de horas administrativas: $18,000
- Mejora en control de inventario: $8,000
- Reducción de errores: $5,000
- Mejora en tiempo de respuesta: $4,000
- **Total beneficios anuales:** $35,000

### ROI Proyectado
- **Año 1:** -$31,000 (Inversión - Beneficios)
- **Año 2:** +$22,000 (Beneficios acumulados)
- **ROI a 3 años:** 85%

## Gestión de Riesgos

### Riesgos Técnicos
1. **Integración con Tango** (Probabilidad: Media, Impacto: Alto)
   - Mitigación: Desarrollo de adaptadores específicos
   
2. **Migración de datos** (Probabilidad: Alta, Impacto: Medio)
   - Mitigación: Plan de limpieza y validación de datos

### Riesgos de Negocio
1. **Resistencia al cambio** (Probabilidad: Alta, Impacto: Alto)
   - Mitigación: Plan de gestión del cambio robusto
   
2. **Capacitación insuficiente** (Probabilidad: Media, Impacto: Medio)
   - Mitigación: Programa de capacitación escalonado

## Recomendaciones

### Decisiones Inmediatas Requeridas
1. ✅ **Aprobación del proyecto** - Decisión gerencial
2. ✅ **Asignación de presupuesto** - Definir fuente de financiamiento
3. ✅ **Designación de project manager** - Recurso interno clave
4. ✅ **Selección de equipo de desarrollo** - Interno vs. externo

### Próximos Pasos
1. **Semana 1-2:** Definición detallada de objetivos del sistema
2. **Semana 3-4:** Desarrollo de historias de usuario
3. **Semana 5-6:** Diseño de mockups y prototipos
4. **Semana 7-8:** Arquitectura técnica detallada

## Conclusión
El proyecto presenta una excelente oportunidad para modernizar los procesos de la empresa con un ROI atractivo y riesgos manejables. La implementación escalonada propuesta permite validar beneficios en cada etapa y ajustar el rumbo según sea necesario.

**Recomendación:** Proceder con la implementación siguiendo el plan propuesto.

---
*Informe elaborado por Test IA Mock el ${new Date().toLocaleString('es-ES')}*
*Estado: Aprobado para continuar con fase de análisis*`;

    return {
      id: `mock-doc-${this.documentCounter++}`,
      fileName: `${projectName}_informe_ejecutivo.md`,
      fileType: 'text/markdown',
      content: content,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      projectId: projectId,
      stage: 'ANALISIS',
      documentType: 'INFORME',
      source: 'GENERATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        roi: '25-30%',
        implementationTime: '6-8 months',
        investment: '$66,000',
        generatedBy: 'mock-ai',
        mockData: true
      }
    };
  }

  // Generar documento OBJETIVOS mock
  generateObjetivosDocument(projectId, projectName) {
    const content = `# Objetivos del Sistema - ${projectName}

## Objetivo General
Desarrollar e implementar un sistema informático integral que modernice y automatice los procesos operativos de la empresa, mejorando la eficiencia, reduciendo errores y proporcionando información en tiempo real para la toma de decisiones estratégicas.

## Objetivos Específicos

### 1. Automatización de Procesos Operativos
**Meta:** Automatizar el 70% de los procesos manuales identificados en el relevamiento.

**Objetivos detallados:**
- ✅ Automatizar el proceso de generación de pedidos
- ✅ Implementar workflow automático para aprobaciones
- ✅ Automatizar la actualización de inventario
- ✅ Generar facturas electrónicas automáticamente
- ✅ Crear alertas automáticas para eventos críticos

**KPIs:**
- Reducción del 60% en tiempo de procesamiento de pedidos
- Eliminación del 80% de tareas manuales repetitivas
- Reducción del 90% en errores de transcripción

### 2. Integración y Centralización de Datos
**Meta:** Unificar toda la información empresarial en una plataforma centralizada.

**Objetivos detallados:**
- ✅ Centralizar información de clientes
- ✅ Unificar datos de productos e inventario
- ✅ Integrar información financiera y contable
- ✅ Consolidar historial de transacciones
- ✅ Sincronizar datos entre todos los módulos

**KPIs:**
- 100% de datos accesibles desde una sola plataforma
- Eliminación de duplicación de datos
- Tiempo de búsqueda de información < 30 segundos

### 3. Mejora en Control de Inventario
**Meta:** Implementar control de inventario en tiempo real con trazabilidad completa.

**Objetivos detallados:**
- ✅ Implementar control de stock en tiempo real
- ✅ Establecer niveles mínimos y máximos automáticos
- ✅ Crear alertas de reposición
- ✅ Implementar trazabilidad de productos
- ✅ Generar reportes de rotación automáticos

**KPIs:**
- Reducción del 50% en quiebres de stock
- Mejora del 30% en rotación de inventario
- Precisión del inventario > 98%

### 4. Optimización del Proceso de Ventas
**Meta:** Acelerar y mejorar la precisión del proceso de ventas desde el pedido hasta la facturación.

**Objetivos detallados:**
- ✅ Implementar CRM integrado
- ✅ Automatizar generación de cotizaciones
- ✅ Crear workflow de aprobación de ventas
- ✅ Integrar con sistema de facturación
- ✅ Implementar seguimiento de pagos

**KPIs:**
- Reducción del 40% en tiempo de cierre de ventas
- Aumento del 20% en conversión de cotizaciones
- Reducción del 70% en tiempo de facturación

### 5. Implementación de Business Intelligence
**Meta:** Proporcionar información estratégica en tiempo real para la toma de decisiones.

**Objetivos detallados:**
- ✅ Crear dashboard ejecutivo
- ✅ Implementar reportes automáticos
- ✅ Desarrollar KPIs del negocio
- ✅ Crear alertas de rendimiento
- ✅ Implementar análisis predictivo básico

**KPIs:**
- Reportes disponibles en < 5 minutos
- 100% de KPIs actualizados en tiempo real
- Reducción del 80% en tiempo de preparación de reportes

## Objetivos Técnicos

### 6. Escalabilidad y Performance
**Meta:** Desarrollar una arquitectura que soporte el crecimiento de la empresa.

**Objetivos técnicos:**
- ✅ Soporte para 50+ usuarios concurrentes
- ✅ Tiempo de respuesta < 3 segundos
- ✅ Disponibilidad del sistema > 99.5%
- ✅ Arquitectura modular y escalable
- ✅ Capacidad de integración con sistemas futuros

### 7. Seguridad y Compliance
**Meta:** Implementar las mejores prácticas de seguridad y cumplimiento normativo.

**Objetivos de seguridad:**
- ✅ Autenticación multifactor
- ✅ Control de acceso basado en roles
- ✅ Cifrado de datos sensibles
- ✅ Logs de auditoría completos
- ✅ Backup automático diario

### 8. Usabilidad y Adopción
**Meta:** Crear una interfaz intuitiva que facilite la adopción por parte de los usuarios.

**Objetivos de UX:**
- ✅ Interfaz responsive (móvil y desktop)
- ✅ Tiempo de aprendizaje < 4 horas
- ✅ Tasa de adopción > 95%
- ✅ Satisfacción de usuarios > 4/5
- ✅ Soporte multi-idioma (ES/EN)

## Criterios de Éxito

### Criterios Cuantitativos
| Métrica | Situación Actual | Objetivo | Plazo |
|---------|------------------|----------|-------|
| Tiempo procesamiento pedidos | 45 min | 15 min | 6 meses |
| Errores de inventario | 15% | <2% | 4 meses |
| Tiempo generación reportes | 2 días | 5 min | 8 meses |
| Satisfacción usuario | N/A | >4/5 | 12 meses |
| Disponibilidad sistema | N/A | >99.5% | 3 meses |

### Criterios Cualitativos
- ✅ **Facilidad de uso:** Sistema intuitivo que requiera mínima capacitación
- ✅ **Confiabilidad:** Sistema estable sin interrupciones frecuentes
- ✅ **Flexibilidad:** Capacidad de adaptarse a cambios del negocio
- ✅ **Integrabilidad:** Fácil integración con sistemas existentes y futuros
- ✅ **Mantenibilidad:** Código limpio y documentado para futuras modificaciones

## Beneficios Esperados

### Beneficios Operacionales
1. **Eficiencia:** Reducción del 60% en tareas administrativas
2. **Precisión:** Eliminación del 90% de errores manuales
3. **Velocidad:** Procesamiento 3x más rápido de operaciones
4. **Visibilidad:** Información en tiempo real del estado del negocio

### Beneficios Estratégicos
1. **Escalabilidad:** Capacidad para crecer sin cambios mayores
2. **Competitividad:** Mayor agilidad en respuesta al mercado
3. **Decisiones:** Información precisa para decisiones estratégicas
4. **Satisfacción:** Mejor experiencia para clientes y empleados

### Beneficios Financieros
- **ROI:** 25-30% en el primer año
- **Ahorro:** $35,000 anuales en costos operativos
- **Ingresos:** Potencial aumento del 15% por mejor servicio
- **Eficiencia:** Reducción del 40% en costos administrativos

## Restricciones y Limitaciones

### Restricciones Técnicas
- Integración obligatoria con sistema Tango existente
- Migración sin pérdida de información histórica
- Funcionamiento durante horario laboral sin interrupciones

### Restricciones de Negocio
- Presupuesto máximo: $75,000
- Plazo máximo de implementación: 8 meses
- Capacitación debe ser incluida en el costo
- Soporte técnico primer año incluido

### Restricciones Organizacionales
- Disponibilidad limitada de usuarios clave para testing
- Resistencia potencial al cambio en algunos departamentos
- Necesidad de aprobación gerencial para cambios importantes

## Plan de Medición y Seguimiento

### Fases de Medición
1. **Baseline (Mes 0):** Medición de situación actual
2. **Implementación (Meses 1-6):** Seguimiento de avance técnico
3. **Adopción (Meses 7-9):** Medición de adopción y uso
4. **Beneficios (Meses 10-12):** Medición de ROI y beneficios

### Métricas de Seguimiento
- **Técnicas:** Performance, disponibilidad, errores
- **Funcionales:** Completitud de funcionalidades, bugs
- **Adopción:** Usuarios activos, tiempo de uso, satisfacción
- **Negocio:** Eficiencia, precisión, ahorro de costos

## Conclusión
Los objetivos definidos establecen un marco claro para el desarrollo del sistema, con metas específicas, medibles y alcanzables. El enfoque escalonado permite validar el progreso en cada etapa y ajustar el rumbo según sea necesario.

**Próximo paso:** Desarrollo de historias de usuario detalladas basadas en estos objetivos.

---
*Objetivos definidos por Test IA Mock el ${new Date().toLocaleString('es-ES')}*
*Estado: Aprobado para desarrollo de historias de usuario*`;

    return {
      id: `mock-doc-${this.documentCounter++}`,
      fileName: `${projectName}_objetivos.md`,
      fileType: 'text/markdown',
      content: content,
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      projectId: projectId,
      stage: 'ANALISIS',
      documentType: 'OBJETIVOS',
      source: 'GENERATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        objectivesCount: 8,
        kpisCount: 15,
        benefitsCount: 12,
        generatedBy: 'mock-ai',
        mockData: true
      }
    };
  }

  // Simular respuesta de procesamiento de documentos
  async simulateProcessDocuments(data, speed = 'normal') {
    await this.simulateDelay(speed);
    
    const { projectId, projectName = 'Proyecto Mock', documentType = 'OBJETIVOS' } = data;
    
    // Generar documento según el tipo solicitado
    let mockDocument;
    switch (documentType.toUpperCase()) {
      case 'CLIENTE':
        mockDocument = this.generateClienteDocument(projectId, projectName);
        break;
      case 'RELEVAMIENTO':
        mockDocument = this.generateRelevamientoDocument(projectId, projectName);
        break;
      case 'INFORME':
        mockDocument = this.generateInformeDocument(projectId, projectName);
        break;
      case 'OBJETIVOS':
        mockDocument = this.generateObjetivosDocument(projectId, projectName);
        break;
      default:
        mockDocument = this.generateObjetivosDocument(projectId, projectName);
    }

    return {
      success: true,
      message: `Documento ${documentType} generado exitosamente con Test IA Mock`,
      data: mockDocument,
      metadata: {
        provider: 'mock-ai',
        processingTime: MOCK_SPEEDS[speed]?.delay || 1500,
        mockData: true,
        generatedAt: new Date().toISOString()
      }
    };
  }

  // Simular chat con documentos
  async simulateChatWithDocuments(chatData, speed = 'normal') {
    await this.simulateDelay(speed);
    
    const responses = [
      "Basándome en el análisis de los documentos del proyecto, puedo proporcionar la siguiente información...",
      "Los documentos indican que el proyecto se enfoca principalmente en automatización de procesos...",
      "Según el relevamiento realizado, las principales oportunidades de mejora son...",
      "El análisis de los documentos muestra que los stakeholders clave identificados son...",
      "Los objetivos del proyecto están claramente definidos en la documentación...",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      success: true,
      data: {
        response: `${randomResponse} (Esta es una respuesta generada por Test IA Mock para propósitos de testing)`,
        sources: [
          {
            documentId: 'mock-doc-1',
            documentName: 'Cliente Info Mock',
            relevantSections: ['Contexto del negocio', 'Objetivos principales']
          }
        ],
        metadata: {
          provider: 'mock-ai',
          responseTime: MOCK_SPEEDS[speed]?.delay || 1500,
          mockData: true,
          confidence: 0.95
        }
      }
    };
  }

  // Simular estado de salud de IA
  async simulateHealthCheck() {
    return {
      success: true,
      status: 'healthy',
      ai: {
        provider: 'Test IA Mock',
        model: 'mock-v1.0',
        status: 'connected',
        responseTime: '0.5s',
        mockMode: true
      },
      capabilities: {
        textGeneration: true,
        documentAnalysis: true,
        multiLanguage: true,
        structuredOutput: true
      },
      metrics: {
        uptime: '100%',
        successRate: '100%',
        averageResponseTime: '1.2s'
      }
    };
  }

  // Simular información de IA
  async simulateAIInfo() {
    return {
      success: true,
      modelInfo: {
        name: 'Test IA Mock',
        version: '1.0.0',
        provider: 'Mock Service',
        type: 'testing',
        mockMode: true
      },
      availableDocumentTypes: [
        'CLIENTE', 'RELEVAMIENTO', 'INFORME', 'OBJETIVOS',
        'HISTORIAS_USUARIO', 'DIAGRAMAS_FLUJO', 'SPRINTS', 
        'DER', 'CASOS_USO'
      ],
      capabilities: {
        textGeneration: true,
        documentAnalysis: true,
        multiLanguage: true,
        structuredOutput: true,
        fastProcessing: true
      }
    };
  }
}

export default MockAIService;