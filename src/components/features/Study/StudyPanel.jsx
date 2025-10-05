import React, { useState, useEffect, useCallback } from 'react';
import { processDocuments, getAIInfo } from '../../../services';
import { loadClientInfo, generateRelevamiento, generateInformeEjecutivo } from '../../../services/aiService';
import { FileIcon, PdfIcon, DocIcon, DownloadIcon, PlayIcon } from '../../ui/Icons';
import {
  ClienteSection,
  RelevamientoSection,
  InformeSection,
  ObjetivosSection,
  DiagramasFlujoSection,
  HistoriasUsuarioSection,
  SprintsSection,
  DerSection,
  CasosUsoSection
} from './sections';

const StudyPanel = ({ selectedFiles, selectedProject }) => {
  const [activeTab, setActiveTab] = useState('CLIENTE');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: '', 
    business: '', 
    description: '', 
    needs: '', 
    history: ''
  });

  const [relevamientoInfo, setRelevamientoInfo] = useState({
    entrevistas: {
      stakeholders: [
        { id: 1, nombre: '', cargo: '', area: '', contacto: '', notas: '' }
      ],
      preguntas: [
        { id: 1, categoria: 'Procesos Actuales', pregunta: '', respuesta: '' }
      ]
    },
    cuestionarios: {
      areas: ['Operaciones', 'IT', 'RRHH', 'Finanzas'],
      preguntas: [
        { id: 1, area: 'Operaciones', tipo: 'abierta', pregunta: '', respuesta: '' }
      ]
    },
    observacion: {
      procesos: [
        { id: 1, proceso: '', descripcion: '', problemas: '', oportunidades: '' }
      ],
      sistemas: [
        { id: 1, sistema: '', version: '', usuarios: '', problemas: '' }
      ]
    },
    documentacion: {
      archivos: [
        { id: 1, nombre: '', tipo: '', ubicacion: '', relevancia: '', notas: '' }
      ],
      normativas: ''
    }
  });

  // Cargar información existente del cliente para un proyecto
  const loadExistingClientInfo = useCallback(async (projectId) => {
    try {
      const response = await loadClientInfo(projectId);
      
      if (response.success && response.clientInfo) {
        setClientInfo(response.clientInfo);
      } else {
        // Limpiar el formulario si no hay información
        setClientInfo({
          name: '', 
          business: '', 
          description: '', 
          needs: '', 
          history: ''
        });
      }
    } catch (error) {
      console.error('Error loading client info:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Limpiar el formulario en caso de error
      setClientInfo({
        name: '', 
        business: '', 
        description: '', 
        needs: '', 
        history: ''
      });
    }
  }, []);

  // Sincronizar projectId con selectedProject
  useEffect(() => {
    if (selectedProject && selectedProject.id) {
      setProjectId(selectedProject.id);
      
      // Cargar información del cliente si existe para este proyecto
      loadExistingClientInfo(selectedProject.id);
    } else {
      setProjectId(null);
      // Limpiar información del cliente
      setClientInfo({
        name: '', 
        business: '', 
        description: '', 
        needs: '', 
        history: ''
      });
    }
  }, [selectedProject, loadExistingClientInfo]);

  // Etapas del desarrollo con sus secciones
  const projectStages = {
    PRELIMINAR: {
      name: 'Etapa Preliminar',
      sections: [
        { id: 'CLIENTE', name: 'Cliente', icon: '👤', description: 'Información del cliente y requerimientos' },
        { id: 'RELEVAMIENTO', name: 'Relevamiento', icon: '📋', description: 'Análisis y recopilación de información' },
        { id: 'INFORME', name: 'Informe', icon: '📄', description: 'Informe ejecutivo del relevamiento' }
      ]
    },
    ANALISIS: {
      name: 'Etapa de Análisis',
      sections: [
        { id: 'OBJETIVOS', name: 'Objetivos', icon: '🎯', description: 'Objetivos del sistema informático' },
        { id: 'DIAGRAMAS_FLUJO', name: 'Diagramas de Flujo', icon: '🔄', description: 'Diagramas de flujo de datos (DFD)' },
        { id: 'HISTORIAS_USUARIO', name: 'Historias de Usuario', icon: '📖', description: 'Historias de usuario y metodologías ágiles' }
      ]
    },
    DISENO: {
      name: 'Etapa de Diseño',
      sections: [
        { id: 'SPRINTS', name: 'Sprints', icon: '⚡', description: 'Planificación de sprints SCRUM' },
        { id: 'DER', name: 'DER', icon: '🗄️', description: 'Diagrama Entidad-Relación' },
        { id: 'CASOS_USO', name: 'Casos de Uso', icon: '⚙️', description: 'Casos de uso del sistema' }
      ]
    }
  };

  useEffect(() => {
    loadAIInfo();
  }, []);

  const loadAIInfo = async () => {
    try {
      await getAIInfo();
    } catch (err) {
      console.error('Error al cargar información de IA:', err);
    }
  };

  // Función para descargar documentos generados
  const downloadGeneratedDocument = (result) => {
    if (!result.content && !result.fileName) {
      console.error('No hay contenido para descargar');
      return;
    }

    const content = result.content || JSON.stringify(result, null, 2);
    const fileName = result.fileName || `documento_${result.documentType || 'generado'}.md`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateDocument = async (documentType, additionalParams = {}) => {
    if (!selectedProject) {
      setError('Selecciona un proyecto primero');
      return;
    }

    setProcessing(true);
    setError(null);
    setResults(null);

    try {
      let response;

      // Manejar generación específica de relevamiento
      if (documentType === 'RELEVAMIENTO') {
        response = await generateRelevamiento(selectedProject.id, clientInfo, relevamientoInfo);
      } 
      // Manejar generación específica de informe ejecutivo
      else if (documentType === 'informe-ejecutivo') {
        const { configuracion } = additionalParams;
        response = await generateInformeEjecutivo(
          selectedProject.id, 
          clientInfo, 
          relevamientoInfo, 
          configuracion
        );
      } 
      else {
        // Preparar datos para otros tipos de documento
        let requestData = {
          documentType,
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          clientInfo: clientInfo,
          ...additionalParams
        };

        // Agregar archivos si están disponibles
        if (selectedFiles.length > 0) {
          requestData.extractedTexts = selectedFiles.map(file => ({
            fileName: file.fileName || file,
            text: file.extractedText || `Contenido extraído de ${file.fileName || file}`,
            extractedAt: new Date().toISOString()
          }));
        }

        response = await processDocuments(requestData);
      }

      setResults(response);
      
      // Revalidar precondiciones después de generar un documento
      if (documentType === 'RELEVAMIENTO' || documentType === 'informe-ejecutivo') {
        // Esto activará la revalidación en las secciones correspondientes
        setTimeout(() => {
          // Trigger re-validation by updating a dependency
          setProjectId(prev => prev);
        }, 1000);
      }
      
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
        <h2>Gestión de Proyectos</h2>
        
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
        {activeTab === 'CLIENTE' && (
          <ClienteSection 
            clientInfo={clientInfo}
            setClientInfo={setClientInfo}
            projectId={projectId}
            setProjectId={setProjectId}
          />
        )}

        {activeTab === 'RELEVAMIENTO' && (
          <RelevamientoSection 
            relevamientoInfo={relevamientoInfo}
            setRelevamientoInfo={setRelevamientoInfo}
            projectId={projectId}
            selectedProject={selectedProject}
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {activeTab === 'INFORME' && (
          <InformeSection 
            projectId={projectId}
            clientInfo={clientInfo}
            relevamientoInfo={relevamientoInfo}
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
            generationResults={results?.results || []}
          />
        )}

        {/* ETAPA DE ANÁLISIS */}
        {activeTab === 'OBJETIVOS' && (
          <ObjetivosSection 
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {activeTab === 'DIAGRAMAS_FLUJO' && (
          <DiagramasFlujoSection 
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {activeTab === 'HISTORIAS_USUARIO' && (
          <HistoriasUsuarioSection 
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {/* ETAPA DE DISEÑO */}
        {activeTab === 'SPRINTS' && (
          <SprintsSection 
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {activeTab === 'DER' && (
          <DerSection 
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {activeTab === 'CASOS_USO' && (
          <CasosUsoSection 
            handleGenerateDocument={handleGenerateDocument}
            processing={processing}
          />
        )}

        {/* Sección de Resultados */}
        {results && (
          <div className="results-panel">
            <div className="results-header">
              <h4>📊 Resultados Generados</h4>
              {results.fileName && (
                <button 
                  className="download-button"
                  onClick={() => downloadGeneratedDocument(results)}
                  title="Descargar documento"
                >
                  <DownloadIcon className="download-icon" />
                  Descargar
                </button>
              )}
            </div>
            <div className="results-content">
              {results.content ? (
                <div className="document-preview">
                  <div className="document-info">
                    <p><strong>Archivo:</strong> {results.fileName}</p>
                    <p><strong>Tipo:</strong> {results.documentType || 'Documento generado'}</p>
                    <p><strong>Proyecto:</strong> {results.projectName}</p>
                    {results.wordCount && (
                      <p><strong>Palabras:</strong> {results.wordCount}</p>
                    )}
                  </div>
                  <div className="document-content">
                    <h5>Vista previa del contenido:</h5>
                    <div className="content-preview">
                      {results.content.substring(0, 500)}...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="results-raw">
                  <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
              )}
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