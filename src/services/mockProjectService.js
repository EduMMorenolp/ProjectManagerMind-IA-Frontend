/**
 * Servicio Mock para gestión de proyectos
 * Simula un backend completo en el frontend para testing
 */

import { MOCK_SPEEDS } from '../constants/aiProviders.js';

// Definiciones de etapas y tipos de documentos
const PROJECT_STAGES = {
  PRELIMINAR: { key: 'PRELIMINAR', name: 'Etapa Preliminar' },
  ANALISIS: { key: 'ANALISIS', name: 'Etapa de Análisis' },
  DISENO: { key: 'DISENO', name: 'Etapa de Diseño' }
};

const DOCUMENT_TYPES = {
  // Etapa Preliminar
  CLIENTE: { key: 'CLIENTE', name: 'Cliente', stage: 'PRELIMINAR' },
  RELEVAMIENTO: { key: 'RELEVAMIENTO', name: 'Relevamiento', stage: 'PRELIMINAR' },
  
  // Etapa de Análisis
  INFORME: { key: 'INFORME', name: 'Informe', stage: 'ANALISIS' },
  OBJETIVOS: { key: 'OBJETIVOS', name: 'Objetivos', stage: 'ANALISIS' },
  DIAGRAMAS_FLUJO: { key: 'DIAGRAMAS_FLUJO', name: 'Diagramas de Flujo', stage: 'ANALISIS' },
  HISTORIAS_USUARIO: { key: 'HISTORIAS_USUARIO', name: 'Historias de Usuario', stage: 'ANALISIS' },
  
  // Etapa de Diseño
  SPRINTS: { key: 'SPRINTS', name: 'Sprints', stage: 'DISENO' },
  DER: { key: 'DER', name: 'DER', stage: 'DISENO' },
  CASOS_USO: { key: 'CASOS_USO', name: 'Casos de Uso', stage: 'DISENO' }
};

class MockProjectService {
  constructor() {
    this.storageKey = 'mockProjects';
    this.documentStorageKey = 'mockDocuments';
    this.processedResultsKey = 'mockProcessedResults';
    this.projectCounter = this.getLastProjectId() + 1;
    this.documentCounter = this.getLastDocumentId() + 1;
    this.resultCounter = this.getLastResultId() + 1;
  }

  // Helpers para obtener últimos IDs
  getLastProjectId() {
    const projects = this.getAllProjects();
    return projects.length > 0 ? Math.max(...projects.map(p => parseInt(p.id))) : 0;
  }

  getLastDocumentId() {
    const documents = this.getAllDocuments();
    return documents.length > 0 ? Math.max(...documents.map(d => parseInt(d.id))) : 0;
  }

  getLastResultId() {
    const results = this.getAllProcessedResults();
    return results.length > 0 ? Math.max(...results.map(r => parseInt(r.id))) : 0;
  }

  // Simular delay de procesamiento
  async simulateDelay() {
    const config = this.getMockConfig();
    const delayConfig = MOCK_SPEEDS[config.speed] || MOCK_SPEEDS.normal;
    const delay = Math.random() * (delayConfig.max - delayConfig.min) + delayConfig.min;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Obtener configuración mock
  getMockConfig() {
    const aiConfig = JSON.parse(localStorage.getItem('aiConfig') || '{}');
    return aiConfig.mockConfig || { speed: 'normal', simulateErrors: false };
  }

  // Métodos de almacenamiento
  getAllProjects() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveProjects(projects) {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }

  getAllDocuments() {
    return JSON.parse(localStorage.getItem(this.documentStorageKey) || '[]');
  }

  saveDocuments(documents) {
    localStorage.setItem(this.documentStorageKey, JSON.stringify(documents));
  }

  getAllProcessedResults() {
    return JSON.parse(localStorage.getItem(this.processedResultsKey) || '[]');
  }

  saveProcessedResults(results) {
    localStorage.setItem(this.processedResultsKey, JSON.stringify(results));
  }

  // Generar datos mock
  generateMockProject(name) {
    const id = this.projectCounter++;
    const now = new Date().toISOString();
    
    return {
      id: id.toString(),
      name: name || `Proyecto Mock ${id}`,
      description: `Proyecto de prueba generado automáticamente el ${new Date().toLocaleDateString()}`,
      clientName: `Cliente Mock ${id}`,
      startDate: now,
      endDate: null,
      status: 'ACTIVE',
      stage: 'PRELIMINAR',
      createdAt: now,
      updatedAt: now,
      _count: { documents: 0, processedResults: 0 }
    };
  }

  generateMockDocument(projectId, file, stage = 'PRELIMINAR', type = 'CLIENTE') {
    const id = this.documentCounter++;
    const now = new Date().toISOString();

    return {
      id: id.toString(),
      projectId: projectId.toString(),
      filename: file.name,
      originalName: file.name,
      mimetype: file.type,
      size: file.size,
      stage: stage,
      type: type,
      documentType: type, // Agregar documentType para compatibilidad con StudyContext
      status: 'UPLOADED',
      uploadedAt: now,
      createdAt: now,
      updatedAt: now,
      // Simular contenido extraído
      extractedText: `Contenido simulado extraído del archivo ${file.name}. 
Este es un texto de prueba que simula el contenido real del documento.
Incluye información relevante para el proyecto de desarrollo de software.`,
      metadata: {
        pages: Math.floor(Math.random() * 20) + 1,
        words: Math.floor(Math.random() * 1000) + 100,
        characters: Math.floor(Math.random() * 5000) + 500
      }
    };
  }

  // API Methods - Projects
  async getProjects() {
    await this.simulateDelay();
    const projects = this.getAllProjects();
    
    // Calcular conteos para cada proyecto
    const documents = this.getAllDocuments();
    const results = this.getAllProcessedResults();
    
    const projectsWithCounts = projects.map(project => ({
      ...project,
      _count: {
        documents: documents.filter(d => d.projectId === project.id).length,
        processedResults: results.filter(r => r.projectId === project.id).length
      }
    }));

    return {
      success: true,
      count: projectsWithCounts.length,
      projects: projectsWithCounts
    };
  }

  async getProjectById(projectId) {
    await this.simulateDelay();
    const projects = this.getAllProjects();
    const project = projects.find(p => p.id === projectId.toString());
    
    if (!project) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    // Agregar documentos y resultados relacionados
    const documents = this.getAllDocuments().filter(d => d.projectId === projectId.toString());
    const processedResults = this.getAllProcessedResults().filter(r => r.projectId === projectId.toString());

    return {
      success: true,
      data: {
        ...project,
        documents,
        processedResults,
        _count: {
          documents: documents.length,
          processedResults: processedResults.length
        }
      }
    };
  }

  async createProject(projectData) {
    await this.simulateDelay();
    const newProject = this.generateMockProject(projectData.name);
    
    if (projectData.description) {
      newProject.description = projectData.description;
    }
    
    const projects = this.getAllProjects();
    projects.push(newProject);
    this.saveProjects(projects);

    console.log('🧪 Proyecto mock creado:', newProject);
    
    // Disparar evento personalizado para notificar a componentes
    window.dispatchEvent(new CustomEvent('project-created', {
      detail: { project: newProject }
    }));
    
    return {
      success: true,
      data: newProject
    };
  }

  async updateProject(projectId, projectData) {
    await this.simulateDelay();
    const projects = this.getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId.toString());
    
    if (projectIndex === -1) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    this.saveProjects(projects);

    return {
      success: true,
      data: projects[projectIndex]
    };
  }

  async deleteProject(projectId) {
    await this.simulateDelay();
    let projects = this.getAllProjects();
    const projectExists = projects.some(p => p.id === projectId.toString());
    
    if (!projectExists) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    // Eliminar proyecto
    projects = projects.filter(p => p.id !== projectId.toString());
    this.saveProjects(projects);

    // Eliminar documentos relacionados
    let documents = this.getAllDocuments();
    documents = documents.filter(d => d.projectId !== projectId.toString());
    this.saveDocuments(documents);

    // Eliminar resultados procesados relacionados
    let results = this.getAllProcessedResults();
    results = results.filter(r => r.projectId !== projectId.toString());
    this.saveProcessedResults(results);

    return {
      success: true,
      message: 'Proyecto eliminado exitosamente'
    };
  }

  // API Methods - Documents
  async getProjectDocuments(projectId, filters = {}) {
    await this.simulateDelay();
    let documents = this.getAllDocuments().filter(d => d.projectId === projectId.toString());
    
    // Aplicar filtros
    if (filters.stage) {
      documents = documents.filter(d => d.stage === filters.stage);
    }
    
    if (filters.type) {
      documents = documents.filter(d => d.type === filters.type);
    }

    return {
      success: true,
      data: documents
    };
  }

  async uploadDocument(projectId, file, metadata = {}) {
    await this.simulateDelay();
    
    // Verificar que el proyecto existe
    const projects = this.getAllProjects();
    const project = projects.find(p => p.id === projectId.toString());
    
    if (!project) {
      throw new Error(`Proyecto con ID ${projectId} no encontrado`);
    }

    const newDocument = this.generateMockDocument(
      projectId, 
      file, 
      metadata.stage, 
      metadata.type
    );
    
    const documents = this.getAllDocuments();
    documents.push(newDocument);
    this.saveDocuments(documents);

    console.log('🧪 Documento mock subido:', newDocument);
    
    return {
      success: true,
      data: newDocument
    };
  }

  async deleteDocument(documentId) {
    await this.simulateDelay();
    let documents = this.getAllDocuments();
    const documentExists = documents.some(d => d.id === documentId.toString());
    
    if (!documentExists) {
      throw new Error(`Documento con ID ${documentId} no encontrado`);
    }

    documents = documents.filter(d => d.id !== documentId.toString());
    this.saveDocuments(documents);

    return {
      success: true,
      message: 'Documento eliminado exitosamente'
    };
  }

  // API Methods - Processed Results
  async getProcessedResults(projectId, filters = {}) {
    await this.simulateDelay();
    let results = this.getAllProcessedResults().filter(r => r.projectId === projectId.toString());
    
    if (filters.stage) {
      results = results.filter(r => r.stage === filters.stage);
    }
    
    if (filters.type) {
      results = results.filter(r => r.type === filters.type);
    }

    return {
      success: true,
      data: results
    };
  }

  async saveProcessedResult(projectId, resultData) {
    await this.simulateDelay();
    
    const id = this.resultCounter++;
    const now = new Date().toISOString();
    
    const processedResult = {
      id: id.toString(),
      projectId: projectId.toString(),
      type: resultData.type,
      stage: resultData.stage,
      content: resultData.content,
      metadata: resultData.metadata || {},
      status: 'COMPLETED',
      createdAt: now,
      updatedAt: now
    };

    const results = this.getAllProcessedResults();
    results.push(processedResult);
    this.saveProcessedResults(results);

    console.log('🧪 Resultado procesado mock guardado:', processedResult);
    
    return {
      success: true,
      data: processedResult
    };
  }

  // Crear documentos completos para un proyecto
  async createCompleteProjectDocuments(projectId) {
    const documentTypes = Object.values(DOCUMENT_TYPES);
    const createdDocuments = [];
    
    for (const docType of documentTypes) {
      // Crear un archivo mock para cada tipo de documento
      const mockFile = this.createMockFile(docType.name, docType.key);
      
      const newDocument = this.generateMockDocument(
        projectId,
        mockFile,
        docType.stage,
        docType.key
      );
      
      // Agregar contenido específico según el tipo
      newDocument.extractedText = this.getMockDocumentContent(docType.key, docType.name);
      
      const documents = this.getAllDocuments();
      documents.push(newDocument);
      this.saveDocuments(documents);
      
      createdDocuments.push(newDocument);
      
      console.log(`🧪 Documento ${docType.name} creado para proyecto ${projectId}`);
    }
    
    return createdDocuments;
  }

  // Crear archivo mock
  createMockFile(name, type) {
    return {
      name: `${name}_${type}.pdf`,
      type: 'application/pdf',
      size: Math.floor(Math.random() * 500000) + 100000 // 100KB - 500KB
    };
  }

  // Obtener contenido mock específico por tipo de documento
  getMockDocumentContent(type, name) {
    const contentMap = {
      CLIENTE: `Información del Cliente - E-commerce Platform
      
Cliente: TechCorp Solutions
Contacto: Juan Pérez (CEO)
Email: juan.perez@techcorp.com
Teléfono: +54 11 1234-5678

REQUERIMIENTOS INICIALES:
- Plataforma de comercio electrónico completa
- Gestión de productos y categorías
- Carrito de compras y checkout
- Sistema de pagos integrado
- Panel administrativo
- Gestión de usuarios y perfiles
- Sistema de notificaciones

OBJETIVOS DEL NEGOCIO:
- Aumentar ventas online en 300%
- Expandir mercado a nivel nacional
- Integrar con sistemas existentes
- Mejorar experiencia del usuario`,

      RELEVAMIENTO: `Relevamiento Técnico - E-commerce Platform

SITUACIÓN ACTUAL:
- Sitio web estático existente
- Base de datos MySQL legacy
- Sistema de gestión manual
- Sin integración de pagos online

INFRAESTRUCTURA ACTUAL:
- Servidor compartido básico
- Hosting tradicional
- Sin CDN configurado
- Backup manual

ANÁLISIS DE COMPETENCIA:
- MercadoLibre, Amazon, Tienda Nube
- Funcionalidades identificadas
- Benchmarking de performance
- Análisis de UX/UI

REQUERIMIENTOS TÉCNICOS:
- Escalabilidad para 10,000 usuarios concurrentes
- Integración con Mercado Pago
- Responsive design
- SEO optimizado
- Analytics integrado`,

      INFORME: `Informe Ejecutivo - Análisis E-commerce Platform

RESUMEN EJECUTIVO:
El proyecto E-commerce Platform representa una oportunidad estratégica para TechCorp Solutions de digitalizar completamente sus operaciones de venta y expandir su alcance de mercado.

ANÁLISIS DE VIABILIDAD:
✅ Viabilidad Técnica: ALTA
✅ Viabilidad Económica: ALTA  
✅ Viabilidad Operativa: MEDIA-ALTA

ARQUITECTURA PROPUESTA:
- Frontend: React.js + Next.js
- Backend: Node.js + Express
- Base de Datos: PostgreSQL
- Pagos: Mercado Pago + Stripe
- Cloud: AWS/Vercel
- CDN: Cloudflare

CRONOGRAMA ESTIMADO:
- Fase 1 (MVP): 3 meses
- Fase 2 (Funcionalidades avanzadas): 2 meses  
- Fase 3 (Optimizaciones): 1 mes

PRESUPUESTO ESTIMADO: $45,000 USD

RIESGOS IDENTIFICADOS:
- Integración con sistemas legacy
- Tiempos de migración de datos
- Capacitación del equipo`,

      OBJETIVOS: `Objetivos del Sistema E-commerce Platform

OBJETIVOS GENERALES:
1. Crear una plataforma de comercio electrónico escalable y moderna
2. Mejorar la experiencia de compra de los clientes
3. Automatizar procesos de gestión y ventas
4. Integrar sistemas de pago y logística

OBJETIVOS ESPECÍFICOS:

FUNCIONALES:
- Catálogo de productos con búsqueda avanzada
- Carrito de compras persistente
- Checkout en 3 pasos máximo
- Gestión de inventario en tiempo real
- Sistema de reviews y calificaciones
- Panel de administración completo
- Reportes y analytics de ventas

TÉCNICOS:
- Tiempo de carga < 3 segundos
- Disponibilidad 99.9%
- Soporte para 10,000 usuarios concurrentes
- SEO score > 90
- Mobile-first responsive design
- Integración con APIs de terceros

NEGOCIO:
- Incrementar conversión en 25%
- Reducir costos operativos en 40%
- Expandir base de clientes en 200%
- ROI positivo en 8 meses`,

      DIAGRAMAS_FLUJO: `Diagramas de Flujo del Sistema E-commerce

FLUJO DE COMPRA:
1. Usuario ingresa al sitio
2. Navega por categorías/busca productos  
3. Selecciona producto y revisa detalles
4. Agrega al carrito
5. Continúa comprando o va al checkout
6. Ingresa datos de envío
7. Selecciona método de pago
8. Confirma pedido
9. Recibe confirmación por email
10. Seguimiento del envío

FLUJO DE GESTIÓN DE PRODUCTOS:
1. Admin accede al panel
2. Crear/editar producto
3. Subir imágenes y especificaciones
4. Configurar precios y stock
5. Asignar categorías y etiquetas
6. Publicar producto
7. Monitorear ventas y stock

FLUJO DE PROCESAMIENTO DE PAGOS:
1. Cliente confirma pedido
2. Redirección a gateway de pago
3. Procesamiento seguro del pago
4. Webhook de confirmación
5. Actualización de estado del pedido
6. Notificación al cliente y admin
7. Generación de factura

FLUJO DE GESTIÓN DE INVENTARIO:
1. Producto vendido
2. Actualización automática de stock
3. Verificación de nivel mínimo
4. Alerta automática si stock bajo
5. Reposición de inventario
6. Actualización de disponibilidad`,

      HISTORIAS_USUARIO: `Historias de Usuario - E-commerce Platform

ÉPICA 1: NAVEGACIÓN Y BÚSQUEDA
- Como cliente, quiero buscar productos por nombre para encontrar lo que necesito rápidamente
- Como cliente, quiero filtrar productos por precio y categoría para refinar mi búsqueda  
- Como cliente, quiero ver productos relacionados para descubrir opciones similares
- Como cliente, quiero guardar productos en favoritos para comprarlos después

ÉPICA 2: CARRITO Y CHECKOUT
- Como cliente, quiero agregar productos al carrito para comprar múltiples items
- Como cliente, quiero modificar cantidades en el carrito para ajustar mi pedido
- Como cliente, quiero calcular costos de envío para conocer el total antes de pagar
- Como cliente, quiero completar la compra en pocos pasos para una experiencia fluida

ÉPICA 3: GESTIÓN DE CUENTA
- Como cliente, quiero crear una cuenta para guardar mis datos y pedidos
- Como cliente, quiero ver mi historial de pedidos para hacer seguimiento
- Como cliente, quiero actualizar mi información personal y direcciones
- Como cliente, quiero resetear mi contraseña si la olvido

ÉPICA 4: ADMINISTRACIÓN
- Como admin, quiero gestionar productos para mantener el catálogo actualizado
- Como admin, quiero ver reportes de ventas para analizar performance
- Como admin, quiero gestionar pedidos para procesar envíos
- Como admin, quiero configurar promociones para incentivar ventas

CRITERIOS DE ACEPTACIÓN:
- Todas las funcionalidades responsive
- Tiempos de carga < 3 segundos
- Validación de formularios
- Manejo de errores user-friendly`,

      SPRINTS: `Planificación de Sprints - E-commerce Platform

SPRINT 1 (2 semanas) - FUNDACIÓN
Objetivo: Establecer base del proyecto y estructura inicial

BACKLOG:
- Configuración del proyecto y repositorio
- Diseño de base de datos  
- Autenticación de usuarios
- Layout básico y navegación
- Página de inicio y categorías

DEFINITION OF DONE:
- Código revisado y aprobado
- Tests unitarios > 80% cobertura
- Responsive design validado
- Performance auditado

SPRINT 2 (2 semanas) - CATÁLOGO
Objetivo: Implementar gestión y visualización de productos

BACKLOG:
- CRUD de productos (admin)
- Listado de productos con filtros
- Página de detalle de producto
- Búsqueda avanzada
- Sistema de categorías

SPRINT 3 (2 semanas) - CARRITO Y CHECKOUT  
Objetivo: Funcionalidad completa de compra

BACKLOG:
- Carrito de compras persistente
- Proceso de checkout
- Integración con Mercado Pago
- Gestión de direcciones de envío
- Confirmación de pedido y emails

SPRINT 4 (2 semanas) - GESTIÓN DE PEDIDOS
Objetivo: Panel administrativo y seguimiento

BACKLOG:
- Panel de administración
- Gestión de pedidos
- Reportes básicos de ventas  
- Sistema de notificaciones
- Gestión de inventario

RETROSPECTIVA CONTINUA:
- Daily standups 9:00 AM
- Sprint review cada viernes
- Retrospectiva y planning cada 2 semanas`,

      DER: `Diagrama Entidad-Relación - E-commerce Platform

ENTIDADES PRINCIPALES:

USER (Usuario)
- id (PK)
- email (UNIQUE)
- password_hash
- first_name
- last_name  
- role (ENUM: customer, admin)
- created_at
- updated_at

PRODUCT (Producto)
- id (PK)
- name
- description
- price
- stock_quantity
- sku (UNIQUE)
- category_id (FK)
- status (ENUM: active, inactive)
- images (JSON)
- created_at
- updated_at

CATEGORY (Categoría)
- id (PK)
- name
- slug (UNIQUE)
- description
- parent_id (FK - self reference)
- sort_order
- created_at

ORDER (Pedido)
- id (PK)
- user_id (FK)
- status (ENUM: pending, paid, shipped, delivered, cancelled)
- total_amount
- shipping_address (JSON)
- payment_method
- payment_status
- notes
- created_at
- updated_at

ORDER_ITEM (Item de Pedido)
- id (PK)
- order_id (FK)
- product_id (FK)
- quantity
- unit_price
- subtotal

CART (Carrito)
- id (PK)
- user_id (FK)
- session_id
- created_at
- updated_at

CART_ITEM (Item de Carrito)
- id (PK)
- cart_id (FK)
- product_id (FK)
- quantity
- added_at

RELACIONES:
- User 1:N Order (Un usuario puede tener múltiples pedidos)
- Order 1:N OrderItem (Un pedido tiene múltiples items)
- Product 1:N OrderItem (Un producto puede estar en múltiples items)
- Category 1:N Product (Una categoría tiene múltiples productos)
- Category 1:N Category (Categorías anidadas - self reference)
- User 1:1 Cart (Un usuario tiene un carrito)
- Cart 1:N CartItem (Un carrito tiene múltiples items)`,

      CASOS_USO: `Casos de Uso - E-commerce Platform

CASO DE USO 1: REGISTRAR USUARIO
Actor: Cliente
Descripción: El cliente se registra en la plataforma

Flujo Principal:
1. Cliente accede a página de registro
2. Completa formulario con datos personales
3. Sistema valida información
4. Sistema crea cuenta y envía email de confirmación
5. Cliente confirma email
6. Sistema activa cuenta

Flujos Alternativos:
- Email ya registrado: mostrar error
- Datos inválidos: solicitar corrección
- Email no confirmado: reenviar confirmación

CASO DE USO 2: REALIZAR COMPRA
Actor: Cliente Registrado
Descripción: Cliente completa una compra

Pre-condiciones: Cliente logueado, productos en carrito

Flujo Principal:
1. Cliente revisa carrito
2. Procede al checkout
3. Confirma dirección de envío
4. Selecciona método de pago
5. Sistema procesa pago
6. Sistema confirma pedido
7. Cliente recibe confirmación

Post-condiciones: Pedido creado, stock actualizado, email enviado

CASO DE USO 3: GESTIONAR PRODUCTOS (ADMIN)
Actor: Administrador
Descripción: Admin gestiona catálogo de productos

Flujo Principal:
1. Admin accede al panel administrativo
2. Selecciona gestión de productos
3. Crea/edita/elimina productos
4. Configura precios y stock
5. Asigna categorías
6. Publica cambios

CASO DE USO 4: PROCESAR PEDIDO
Actor: Administrador
Descripción: Admin procesa pedidos recibidos

Flujo Principal:
1. Admin revisa nuevos pedidos
2. Verifica disponibilidad de productos
3. Prepara pedido para envío
4. Actualiza estado a "enviado"
5. Notifica al cliente con tracking

CASO DE USO 5: BUSCAR PRODUCTOS
Actor: Cliente (registrado o anónimo)
Descripción: Usuario busca productos específicos

Flujo Principal:
1. Usuario ingresa término de búsqueda
2. Sistema muestra resultados
3. Usuario aplica filtros (precio, categoría)
4. Sistema refina resultados
5. Usuario selecciona producto de interés`
    };

    return contentMap[type] || `Contenido simulado para documento de tipo ${name}. Este documento contiene información relevante para el proyecto E-commerce Platform y ha sido generado automáticamente con contenido de ejemplo para testing.`;
  }

  // Regenerar datos completos (limpiar y crear nuevos)
  async regenerateCompleteData() {
    console.log('🧹 Limpiando todos los datos mock...');
    await this.clearAllMockData();
    
    console.log('🌱 Generando nuevos datos mock con documentos completos...');
    const result = await this.seedMockData();
    
    return result;
  }

  // Métodos de utilidad
  async clearAllMockData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.documentStorageKey);
    localStorage.removeItem(this.processedResultsKey);
    
    return {
      success: true,
      message: 'Todos los datos mock han sido eliminados'
    };
  }

  async seedMockData() {
    // Crear algunos proyectos de ejemplo
    const sampleProjects = [
      { name: 'E-commerce Platform', description: 'Desarrollo de plataforma de comercio electrónico' },
      { name: 'CRM System', description: 'Sistema de gestión de relaciones con clientes' },
      { name: 'Mobile App', description: 'Aplicación móvil para gestión de tareas' }
    ];

    for (const projectData of sampleProjects) {
      const result = await this.createProject(projectData);
      
      // Si es el proyecto E-commerce Platform, crear documentos completos
      if (projectData.name === 'E-commerce Platform') {
        console.log('🧪 Creando documentos completos para E-commerce Platform...');
        await this.createCompleteProjectDocuments(result.data.id);
        console.log('✅ Documentos completos creados para E-commerce Platform');
      }
    }

    return {
      success: true,
      message: 'Datos mock de ejemplo creados'
    };
  }
}

// Singleton instance
const mockProjectService = new MockProjectService();

export default mockProjectService;