import React, { useState, useEffect } from 'react';
import { processDocuments, getAIInfo } from '../../../services';
import { FileIcon, PdfIcon, DocIcon, DownloadIcon, PlayIcon } from '../../ui/Icons';

const StudyPanel = ({ selectedFiles, selectedProject }) => {
  const [activeTab, setActiveTab] = useState('cliente');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: '', 
    business: '', 
    description: '', 
    needs: '', 
    history: ''
  });

  // Etapas del desarrollo con sus secciones
  const projectStages = {
    preliminar: {
      name: 'Etapa Preliminar',
      sections: [
        { id: 'cliente', name: 'Cliente', icon: '👤', description: 'Información del cliente y requerimientos' },
        { id: 'relevamiento', name: 'Relevamiento', icon: '📋', description: 'Análisis y recopilación de información' },
        { id: 'informe', name: 'Informe', icon: '📄', description: 'Informe ejecutivo del relevamiento' }
      ]
    },
    analisis: {
      name: 'Etapa de Análisis',
      sections: [
        { id: 'objetivos', name: 'Objetivos', icon: '🎯', description: 'Objetivos del sistema informático' },
        { id: 'diagramas-flujo', name: 'Diagramas de Flujo', icon: '🔄', description: 'Diagramas de flujo de datos (DFD)' },
        { id: 'historias-usuario', name: 'Historias de Usuario', icon: '📖', description: 'Historias de usuario y metodologías ágiles' }
      ]
    },
    diseno: {
      name: 'Etapa de Diseño',
      sections: [
        { id: 'sprints', name: 'Sprints', icon: '⚡', description: 'Planificación de sprints SCRUM' },
        { id: 'der', name: 'DER', icon: '🗄️', description: 'Diagrama Entidad-Relación' },
        { id: 'casos-uso', name: 'Casos de Uso', icon: '⚙️', description: 'Casos de uso del sistema' }
      ]
    }
  };

  useEffect(() => {
    loadAIInfo();
  }, []);

  const loadAIInfo = async () => {
    try {
      const info = await getAIInfo();
      console.log('AI Info loaded:', info);
    } catch (err) {
      console.error('Error al cargar información de IA:', err);
    }
  };

  const handleGenerateDocument = async (documentType) => {
    if (!selectedProject) {
      setError('Selecciona un proyecto primero');
      return;
    }

    setProcessing(true);
    setError(null);
    setResults(null);

    try {
      // Preparar datos según el tipo de documento
      let requestData = {
        documentType,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        clientInfo: clientInfo
      };

      // Agregar archivos si están disponibles
      if (selectedFiles.length > 0) {
        requestData.extractedTexts = selectedFiles.map(file => ({
          fileName: file.fileName || file,
          text: file.extractedText || `Contenido extraído de ${file.fileName || file}`,
          extractedAt: new Date().toISOString()
        }));
      }

      const response = await processDocuments(requestData);
      setResults(response);
      
      // Opcional: cambiar a una tab de resultados
      // setActiveTab('results');
      
    } catch (err) {
      console.error(`Error al generar ${documentType}:`, err);
      setError(err.message || `Error al generar ${documentType}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="study-panel-container">
      <div className="study-panel-header">
        <h2>ProjectManagerMind IA - Gestión de Proyectos</h2>
        
        {/* Navegación por etapas */}
        <div className="project-stages">
          {Object.entries(projectStages).map(([stageKey, stage]) => (
            <div key={stageKey} className="stage-group">
              <h3 className="stage-title">{stage.name}</h3>
              <div className="stage-tabs">
                {stage.sections.map(section => (
                  <button
                    key={section.id}
                    className={`tab-button ${activeTab === section.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(section.id)}
                    title={section.description}
                  >
                    <span className="tab-icon">{section.icon}</span>
                    <span className="tab-text">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="study-panel-content">
        
        {/* ETAPA PRELIMINAR */}
        {activeTab === 'cliente' && (
          <div className="section-container">
            <div className="section-header">
              <h3>👤 Información del Cliente</h3>
              <p className="section-description">Ingresa los datos del cliente y sus requerimientos</p>
            </div>
            
            <div className="client-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Cliente/Empresa</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Clínica Seprise"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Negocio</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Servicios de salud, consultorio médico"
                    value={clientInfo.business}
                    onChange={(e) => setClientInfo({...clientInfo, business: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Descripción de la Empresa</label>
                <textarea 
                  placeholder="¿Qué hace la empresa? ¿Cuál es su actividad principal?"
                  rows="3"
                  value={clientInfo.description}
                  onChange={(e) => setClientInfo({...clientInfo, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Historia y Contexto</label>
                <textarea 
                  placeholder="Historia de la empresa, situación actual, problemas identificados..."
                  rows="4"
                  value={clientInfo.history}
                  onChange={(e) => setClientInfo({...clientInfo, history: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>¿Qué Necesita/Quiere el Cliente?</label>
                <textarea 
                  placeholder="Requerimientos, necesidades específicas, objetivos que busca cumplir..."
                  rows="4"
                  value={clientInfo.needs}
                  onChange={(e) => setClientInfo({...clientInfo, needs: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'relevamiento' && (
          <div className="section-container">
            <div className="section-header">
              <h3>📋 Relevamiento de Información</h3>
              <p className="section-description">Métodos de recopilación: Entrevistas, Cuestionarios, Observación</p>
            </div>
            
            <div className="relevamiento-content">
              <div className="method-selector">
                <h4>Métodos de Relevamiento</h4>
                <div className="methods-grid">
                  <div className="method-card">
                    <h5>📞 Entrevistas</h5>
                    <p>Conversaciones directas con stakeholders</p>
                  </div>
                  <div className="method-card">
                    <h5>📊 Cuestionarios</h5>
                    <p>Formularios estructurados para recopilación</p>
                  </div>
                  <div className="method-card">
                    <h5>👀 Observación</h5>
                    <p>Análisis de procesos existentes</p>
                  </div>
                  <div className="method-card">
                    <h5>📂 Documentos</h5>
                    <p>Revisión de archivos y documentación</p>
                  </div>
                </div>
              </div>
              
              <div className="generate-section">
                <button 
                  className="generate-button" 
                  onClick={() => handleGenerateDocument('relevamiento')}
                  disabled={processing}
                >
                  {processing ? (
                    <span>Generando...</span>
                  ) : (
                    <>
                      <PlayIcon className="button-icon" />
                      Generar Relevamiento
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'informe' && (
          <div className="section-container">
            <div className="section-header">
              <h3>📄 Informe Ejecutivo</h3>
              <p className="section-description">Resumen ejecutivo basado en el relevamiento</p>
            </div>
            
            <div className="informe-content">
              <div className="informe-preview">
                <h4>Contenido del Informe</h4>
                <ul>
                  <li>Resumen ejecutivo</li>
                  <li>Situación actual del cliente</li>
                  <li>Problemática identificada</li>
                  <li>Propuesta de solución</li>
                  <li>Recomendaciones</li>
                </ul>
              </div>
              
              <div className="generate-section">
                <button 
                  className="generate-button" 
                  onClick={() => handleGenerateDocument('informe-ejecutivo')}
                  disabled={processing}
                >
                  {processing ? (
                    <span>Generando...</span>
                  ) : (
                    <>
                      <PlayIcon className="button-icon" />
                      Generar Informe Ejecutivo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA DE ANÁLISIS */}
        {activeTab === 'objetivos' && (
          <div className="section-container">
            <div className="section-header">
              <h3>🎯 Objetivos del Sistema</h3>
              <p className="section-description">Definición de objetivos basados en requerimientos del cliente</p>
            </div>
            
            <div className="objetivos-content">
              <div className="objectives-framework">
                <h4>Tipos de Objetivos</h4>
                <div className="objectives-grid">
                  <div className="objective-type">
                    <h5>🎯 Objetivos Generales</h5>
                    <p>Propósito principal del sistema</p>
                  </div>
                  <div className="objective-type">
                    <h5>📌 Objetivos Específicos</h5>
                    <p>Metas detalladas y medibles</p>
                  </div>
                  <div className="objective-type">
                    <h5>🔍 Límites del Sistema</h5>
                    <p>Alcance y restricciones</p>
                  </div>
                </div>
              </div>
              
              <GenerateButton
                onClick={handleGenerateDocument}
                documentType="objetivos"
                processing={processing}
              >
                Generar Objetivos
              </GenerateButton>
            </div>
          </div>
        )}

        {activeTab === 'diagramas-flujo' && (
          <div className="section-container">
            <div className="section-header">
              <h3>🔄 Diagramas de Flujo de Datos (DFD)</h3>
              <p className="section-description">Componentes, reglas y niveles de diagramas</p>
            </div>
            
            <div className="dfd-content">
              <div className="dfd-levels">
                <div className="level-card">
                  <h5>📊 Diagrama de Contexto</h5>
                  <p>Vista general del sistema</p>
                </div>
                <div className="level-card">
                  <h5>📈 Diagrama Nivel 1</h5>
                  <p>Procesos principales</p>
                </div>
                <div className="level-card">
                  <h5>📉 Diagrama Nivel 2</h5>
                  <p>Detalle de subprocesos</p>
                </div>
              </div>
              
              <GenerateButton
                onClick={handleGenerateDocument}
                documentType="diagramas-flujo"
                processing={processing}
              >
                Generar Diagramas DFD
              </GenerateButton>
            </div>
          </div>
        )}

        {activeTab === 'historias-usuario' && (
          <div className="section-container">
            <div className="section-header">
              <h3>📖 Historias de Usuario</h3>
              <p className="section-description">Metodologías ágiles y plantillas de historias</p>
            </div>
            
            <div className="user-stories-content">
              <div className="agile-info">
                <h4>Metodología Ágil - SCRUM</h4>
                <div className="scrum-elements">
                  <span className="scrum-tag">Product Backlog</span>
                  <span className="scrum-tag">Sprint Planning</span>
                  <span className="scrum-tag">User Stories</span>
                  <span className="scrum-tag">Velocity</span>
                </div>
              </div>
              
              <GenerateButton
                onClick={handleGenerateDocument}
                documentType="historias-usuario"
                processing={processing}
              >
                Generar Historias de Usuario
              </GenerateButton>
            </div>
          </div>
        )}

        {/* ETAPA DE DISEÑO */}
        {activeTab === 'sprints' && (
          <div className="section-container">
            <div className="section-header">
              <h3>⚡ Planificación de Sprints</h3>
              <p className="section-description">Sprint backlog basado en historias de usuario</p>
            </div>
            
            <div className="sprints-content">
              <div className="sprint-planning">
                <h4>Elementos del Sprint</h4>
                <div className="sprint-elements">
                  <div className="element-card">
                    <h5>📋 Product Backlog</h5>
                    <p>Lista priorizada de funcionalidades</p>
                  </div>
                  <div className="element-card">
                    <h5>⏱️ Sprint Backlog</h5>
                    <p>Tareas específicas del sprint</p>
                  </div>
                  <div className="element-card">
                    <h5>🏃 Velocidad del Equipo</h5>
                    <p>Capacidad de trabajo estimada</p>
                  </div>
                </div>
              </div>
              
              <GenerateButton
                onClick={handleGenerateDocument}
                documentType="sprints"
                processing={processing}
              >
                Generar Planning de Sprints
              </GenerateButton>
            </div>
          </div>
        )}

        {activeTab === 'der' && (
          <div className="section-container">
            <div className="section-header">
              <h3>🗄️ Diagrama Entidad-Relación (DER)</h3>
              <p className="section-description">Modelo de datos del sistema</p>
            </div>
            
            <div className="der-content">
              <div className="der-elements">
                <div className="element-info">
                  <h5>Elementos del DER</h5>
                  <ul>
                    <li><strong>Entidades:</strong> Objetos del sistema</li>
                    <li><strong>Relaciones:</strong> Vínculos entre entidades</li>
                    <li><strong>Atributos:</strong> Propiedades de las entidades</li>
                    <li><strong>Cardinalidad:</strong> Tipo de relaciones (1:1, 1:N, N:M)</li>
                  </ul>
                </div>
              </div>
              
              <GenerateButton
                onClick={handleGenerateDocument}
                documentType="der"
                processing={processing}
              >
                Generar Diagrama DER
              </GenerateButton>
            </div>
          </div>
        )}

        {activeTab === 'casos-uso' && (
          <div className="section-container">
            <div className="section-header">
              <h3>⚙️ Casos de Uso</h3>
              <p className="section-description">Casos de uso y actores del sistema</p>
            </div>
            
            <div className="use-cases-content">
              <div className="use-case-elements">
                <h4>Componentes de Casos de Uso</h4>
                <div className="components-grid">
                  <div className="component-card">
                    <h5>👥 Actores</h5>
                    <p>Usuarios del sistema</p>
                  </div>
                  <div className="component-card">
                    <h5>🔄 Casos de Uso</h5>
                    <p>Funcionalidades del sistema</p>
                  </div>
                  <div className="component-card">
                    <h5>🔗 Relaciones</h5>
                    <p>Asociaciones y dependencias</p>
                  </div>
                </div>
              </div>
              
              <GenerateButton
                onClick={handleGenerateDocument}
                documentType="casos-uso"
                processing={processing}
              >
                Generar Casos de Uso
              </GenerateButton>
            </div>
          </div>
        )}

        {/* Sección de Resultados */}
        {results && (
          <div className="results-panel">
            <h4>📊 Resultados Generados</h4>
            <div className="results-content">
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

// Componente reutilizable para botones de generación
const GenerateButton = ({ onClick, documentType, processing, children }) => (
  <div className="generate-section">
    <button 
      className="generate-button" 
      onClick={() => onClick(documentType)}
      disabled={processing}
    >
      {processing ? (
        <span>Generando...</span>
      ) : (
        <>
          <PlayIcon className="button-icon" />
          {children}
        </>
      )}
    </button>
  </div>
);

export default StudyPanel;