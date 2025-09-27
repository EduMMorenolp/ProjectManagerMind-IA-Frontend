import React, { useState, useEffect } from 'react';
import { processDocuments, getAIInfo } from '../services';
import { FileIcon, PdfIcon, DocIcon, DownloadIcon, PlayIcon } from './icons/index.jsx';

const StudyPanel = ({ selectedFiles, selectedProject }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedDocTypes, setSelectedDocTypes] = useState(['relevamiento']);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [aiInfo, setAiInfo] = useState(null);

  const documentTypes = [
    { id: 'relevamiento', name: 'Relevamiento', description: 'Documento de análisis y requerimientos' },
    { id: 'informe-ejecutivo', name: 'Informe Ejecutivo', description: 'Resumen ejecutivo del proyecto' },
    { id: 'default', name: 'Documento General', description: 'Documentación técnica general' }
  ];

  useEffect(() => {
    loadAIInfo();
  }, []);

  const loadAIInfo = async () => {
    try {
      const info = await getAIInfo();
      setAiInfo(info);
    } catch (err) {
      console.error('Error al cargar información de IA:', err);
    }
  };

  const handleDocTypeChange = (docType) => {
    setSelectedDocTypes(prev => 
      prev.includes(docType) 
        ? prev.filter(t => t !== docType)
        : [...prev, docType]
    );
  };

  const handleGenerateDocuments = async () => {
    if (!selectedProject) {
      setError('Selecciona un proyecto primero');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Selecciona al menos un archivo');
      return;
    }

    if (selectedDocTypes.length === 0) {
      setError('Selecciona al menos un tipo de documento');
      return;
    }

    setProcessing(true);
    setError(null);
    setResults(null);

    try {
      // Preparar datos de archivos extraídos (simulado)
      const extractedTexts = selectedFiles.map(file => ({
        fileName: file.fileName || file,
        text: file.extractedText || `Contenido extraído de ${file.fileName || file}`,
        extractedAt: new Date().toISOString()
      }));

      const response = await processDocuments({
        extractedTexts,
        documentTypes: selectedDocTypes,
        projectId: selectedProject.id,
        projectName: selectedProject.name
      });

      setResults(response);
    } catch (err) {
      console.error('Error al generar documentos:', err);
      setError(err.message || 'Error al generar documentos');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="study-panel-container">
      <div className="study-panel-header">
        <h2>Generador de Documentación</h2>
        <div className="study-tabs">
          <button 
            className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generar
          </button>
          <button 
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Resultados
          </button>
          <button 
            className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Configuración
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="study-panel-content">
        {activeTab === 'generate' && (
          <div className="generate-container">
            <div className="project-info">
              <h3>Proyecto Seleccionado</h3>
              {selectedProject ? (
                <div className="project-card">
                  <h4>{selectedProject.name}</h4>
                  <p>{selectedProject.description}</p>
                </div>
              ) : (
                <p className="no-project-message">Selecciona un proyecto en el panel de fuentes</p>
              )}
            </div>

            <div className="files-info">
              <h3>Archivos Seleccionados ({selectedFiles.length})</h3>
              {selectedFiles.length > 0 ? (
                <div className="files-list">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <FileIcon className="file-icon" />
                      <span>{file.fileName || file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-files-message">Selecciona archivos en el panel de fuentes</p>
              )}
            </div>

            <div className="document-types">
              <h3>Tipos de Documentos a Generar</h3>
              <div className="doc-types-grid">
                {documentTypes.map(docType => (
                  <div key={docType.id} className="doc-type-card">
                    <label className="doc-type-label">
                      <input
                        type="checkbox"
                        checked={selectedDocTypes.includes(docType.id)}
                        onChange={() => handleDocTypeChange(docType.id)}
                      />
                      <div className="doc-type-info">
                        <h4>{docType.name}</h4>
                        <p>{docType.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="generate-actions">
              <button 
                className="generate-button"
                onClick={handleGenerateDocuments}
                disabled={processing || !selectedProject || selectedFiles.length === 0}
              >
                {processing ? (
                  <span>Generando...</span>
                ) : (
                  <>
                    <PlayIcon className="button-icon" />
                    Generar Documentación
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-container">
            <h3>Resultados de Generación</h3>
            {results ? (
              <div className="results-content">
                <div className="results-summary">
                  <h4>Resumen</h4>
                  <p>Proyecto: {results.projectName}</p>
                  <p>Documentos generados: {results.processing?.results?.length || 0}</p>
                  <p>Tiempo de procesamiento: {results.processingTime}</p>
                  <p>Modelo usado: {results.modelInfo?.modelName}</p>
                </div>
                
                {results.processing?.results?.map((result, index) => (
                  <div key={index} className="result-item">
                    <h4>{documentTypes.find(t => t.id === result.documentType)?.name}</h4>
                    <div className="result-content">
                      <pre>{result.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-results-message">No hay resultados aún. Genera documentos primero.</p>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="config-container">
            <h3>Configuración de IA</h3>
            {aiInfo ? (
              <div className="ai-info">
                <h4>Estado del Modelo</h4>
                <p>Modelo: {aiInfo.modelInfo?.modelName}</p>
                <p>Proveedor: {aiInfo.modelInfo?.provider || 'Local'}</p>
                <p>Estado: {aiInfo.success ? '✅ Conectado' : '❌ Desconectado'}</p>
              </div>
            ) : (
              <p>Cargando información de IA...</p>
            )}
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default StudyPanel;