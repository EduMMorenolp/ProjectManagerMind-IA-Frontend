import React, { useState } from 'react';
import { generateDiagramasFlujo } from '../../../services/aiService';
import MermaidViewer from './MermaidViewer';
import { PlayIcon, ChevronDownIcon, ChevronRightIcon } from '../../ui/Icons';

const DiagramasFlujoViewer = ({ projectId, onError, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [diagramData, setDiagramData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('contexto');
  const [selectedDiagram, setSelectedDiagram] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    configuracion: false,
    descripcion: true,
    diagrama: true
  });

  // Configuración por defecto
  const [config, setConfig] = useState({
    tipoDiagrama: 'dfd',
    nivelDetalle: 'nivel1',
    notacion: 'mermaid',
    incluirActores: true,
    industry: 'Software'
  });

  const handleGenerate = async () => {
    if (!projectId) {
      onError?.('No se ha seleccionado un proyecto');
      return;
    }

    setLoading(true);
    try {
      const result = await generateDiagramasFlujo(projectId, config);
      
      if (result.success) {
        setDiagramData(result.data);
        setSelectedLevel('contexto'); // Reset to context level
        setSelectedDiagram(0);
        onSuccess?.('Diagramas de flujo generados exitosamente');
      } else {
        throw new Error(result.message || 'Error al generar diagramas');
      }
    } catch (error) {
      console.error('Error generando diagramas:', error);
      onError?.(error.message || 'Error al generar los diagramas de flujo');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getLevelTitle = (level) => {
    const titles = {
      'contexto': '📊 Diagrama de Contexto',
      'nivel1': '📈 Diagrama Nivel 1',
      'nivel2': '📉 Diagrama Nivel 2',
      'detalle': '🔍 Diagrama de Detalle'
    };
    return titles[level] || level;
  };

  const getCurrentDiagrams = () => {
    if (!diagramData?.diagramas) return [];
    
    return diagramData.diagramas.filter(diagram => 
      diagram.nivel === selectedLevel || 
      (selectedLevel === 'contexto' && diagram.tipo === 'contexto')
    );
  };

  const currentDiagrams = getCurrentDiagrams();
  const currentDiagram = currentDiagrams[selectedDiagram];

  return (
    <div className="diagramas-flujo-viewer">
      <div className="viewer-header">
        <h3>🔄 Generador de Diagramas de Flujo de Datos</h3>
        <p className="viewer-description">
          Genera diagramas DFD basados en los documentos del proyecto
        </p>
      </div>

      {/* Panel de Configuración */}
      <div className="config-panel">
        <div 
          className="config-header"
          onClick={() => toggleSection('configuracion')}
        >
          {expandedSections.configuracion ? 
            <ChevronDownIcon className="toggle-icon" /> : 
            <ChevronRightIcon className="toggle-icon" />
          }
          <h4>⚙️ Configuración</h4>
        </div>
        
        {expandedSections.configuracion && (
          <div className="config-content">
            <div className="config-grid">
              <div className="config-field">
                <label>Tipo de Diagrama:</label>
                <select 
                  value={config.tipoDiagrama}
                  onChange={(e) => setConfig(prev => ({ ...prev, tipoDiagrama: e.target.value }))}
                >
                  <option value="dfd">Diagrama de Flujo de Datos (DFD)</option>
                  <option value="proceso">Diagrama de Proceso</option>
                  <option value="sistema">Diagrama de Sistema</option>
                </select>
              </div>

              <div className="config-field">
                <label>Nivel de Detalle:</label>
                <select 
                  value={config.nivelDetalle}
                  onChange={(e) => setConfig(prev => ({ ...prev, nivelDetalle: e.target.value }))}
                >
                  <option value="contexto">Solo Contexto</option>
                  <option value="nivel1">Hasta Nivel 1</option>
                  <option value="nivel2">Hasta Nivel 2</option>
                  <option value="completo">Todos los Niveles</option>
                </select>
              </div>

              <div className="config-field">
                <label>Notación:</label>
                <select 
                  value={config.notacion}
                  onChange={(e) => setConfig(prev => ({ ...prev, notacion: e.target.value }))}
                >
                  <option value="mermaid">Mermaid</option>
                  <option value="standard">Estándar DFD</option>
                </select>
              </div>

              <div className="config-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={config.incluirActores}
                    onChange={(e) => setConfig(prev => ({ ...prev, incluirActores: e.target.checked }))}
                  />
                  Incluir Actores Externos
                </label>
              </div>
            </div>

            <button 
              className="generate-button"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Generando Diagramas...
                </>
              ) : (
                <>
                  <PlayIcon className="button-icon" />
                  Generar Diagramas DFD
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      {diagramData && (
        <>
          {/* Descripción del Análisis */}
          <div className="results-panel">
            <div 
              className="results-header"
              onClick={() => toggleSection('descripcion')}
            >
              {expandedSections.descripcion ? 
                <ChevronDownIcon className="toggle-icon" /> : 
                <ChevronRightIcon className="toggle-icon" />
              }
              <h4>📋 Análisis de Procesos</h4>
            </div>
            
            {expandedSections.descripcion && (
              <div className="results-content">
                {diagramData.analisis && (
                  <div className="analysis-section">
                    <h5>🔍 Resumen del Análisis</h5>
                    <p>{diagramData.analisis.resumen}</p>
                    
                    {diagramData.analisis.procesosIdentificados?.length > 0 && (
                      <div className="processes-list">
                        <h6>📊 Procesos Identificados:</h6>
                        <ul>
                          {diagramData.analisis.procesosIdentificados.map((proceso, idx) => (
                            <li key={idx}>
                              <strong>{proceso.nombre}</strong>: {proceso.descripcion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {diagramData.analisis.entidadesExternas?.length > 0 && (
                      <div className="entities-list">
                        <h6>👥 Entidades Externas:</h6>
                        <ul>
                          {diagramData.analisis.entidadesExternas.map((entidad, idx) => (
                            <li key={idx}>{entidad}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Visualización de Diagramas */}
          <div className="diagram-panel">
            <div 
              className="diagram-header"
              onClick={() => toggleSection('diagrama')}
            >
              {expandedSections.diagrama ? 
                <ChevronDownIcon className="toggle-icon" /> : 
                <ChevronRightIcon className="toggle-icon" />
              }
              <h4>📊 Diagramas Generados</h4>
            </div>
            
            {expandedSections.diagrama && (
              <div className="diagram-content">
                {/* Selector de Nivel */}
                <div className="level-selector">
                  {['contexto', 'nivel1', 'nivel2', 'detalle'].map(level => {
                    const levelDiagrams = diagramData.diagramas?.filter(d => 
                      d.nivel === level || (level === 'contexto' && d.tipo === 'contexto')
                    ) || [];
                    
                    if (levelDiagrams.length === 0) return null;
                    
                    return (
                      <button
                        key={level}
                        className={`level-button ${selectedLevel === level ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedLevel(level);
                          setSelectedDiagram(0);
                        }}
                      >
                        {getLevelTitle(level)}
                        <span className="diagram-count">({levelDiagrams.length})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selector de Diagrama (si hay múltiples) */}
                {currentDiagrams.length > 1 && (
                  <div className="diagram-selector">
                    <label>Diagrama:</label>
                    <select 
                      value={selectedDiagram}
                      onChange={(e) => setSelectedDiagram(parseInt(e.target.value))}
                    >
                      {currentDiagrams.map((diagram, idx) => (
                        <option key={idx} value={idx}>
                          {diagram.titulo || `Diagrama ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Visualización del Diagrama */}
                {currentDiagram && (
                  <div className="diagram-visualization">
                    <MermaidViewer
                      diagram={currentDiagram.codigo}
                      title={currentDiagram.titulo || getLevelTitle(selectedLevel)}
                      onError={(error) => onError?.(error)}
                      height="500px"
                    />
                    
                    {currentDiagram.descripcion && (
                      <div className="diagram-description">
                        <h6>📝 Descripción:</h6>
                        <p>{currentDiagram.descripcion}</p>
                      </div>
                    )}

                    {currentDiagram.componentes?.length > 0 && (
                      <div className="diagram-components">
                        <h6>🔧 Componentes:</h6>
                        <div className="components-grid">
                          {currentDiagram.componentes.map((comp, idx) => (
                            <div key={idx} className="component-card">
                              <strong>{comp.nombre}</strong>
                              <span className="component-type">{comp.tipo}</span>
                              {comp.descripcion && <p>{comp.descripcion}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentDiagrams.length === 0 && (
                  <div className="no-diagrams">
                    <p>No hay diagramas disponibles para el nivel seleccionado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {!diagramData && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🔄</div>
          <h4>Genera Diagramas de Flujo</h4>
          <p>
            Configura los parámetros y genera diagramas DFD basados en los documentos de tu proyecto.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiagramasFlujoViewer;