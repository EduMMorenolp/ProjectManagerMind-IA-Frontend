import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { aiService } from '../../services';
import MermaidViewer from './DiagramViewer/MermaidViewer';

/**
 * Componente para visualizar Diagramas de Entidad-Relación (DER)
 * Genera y muestra DER desde documentos de proyecto con opciones de configuración
 */
const DERViewer = ({ 
  projectId, 
  extractedTexts, 
  projectName,
  initialConfig = {},
  onDERGenerated,
  onError 
}) => {
  // Estados principales
  const [derData, setDerData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('diagram');

  // Referencias para exportación
  const downloadLinkRef = useRef(null);

  // Configuración del DER
  const [config, setConfig] = useState({
    motor: 'postgresql',
    incluirIndices: true,
    incluirConstraints: true,
    incluirVistas: false,
    incluirProcedimientos: false,
    notacion: 'crow_foot',
    nivelNormalizacion: '3NF',
    ...initialConfig
  });

  // Estados para la visualización
  const [viewMode, setViewMode] = useState('mermaid');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [filterText, setFilterText] = useState('');

  /**
   * Genera el diagrama DER
   */
  const generateDER = useCallback(async () => {
    if (!extractedTexts || extractedTexts.length === 0) {
      setError('No hay textos extraídos para analizar');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generando DER con configuración:', config);

      const result = await aiService.generateDER({
        extractedTexts,
        projectId,
        projectName,
        documentTypes: ['relevamiento', 'analisis', 'objetivos'],
        ...config
      });

      if (result.success && result.data) {
        setDerData(result.data);
        
        if (onDERGenerated) {
          onDERGenerated(result.data);
        }

        console.log('DER generado exitosamente:', {
          entidades: result.data.entidades?.length || 0,
          relaciones: result.data.relaciones?.length || 0
        });
      } else {
        throw new Error(result.error || 'Error generando DER');
      }
    } catch (err) {
      console.error('Error generando DER:', err);
      const errorMessage = err.message || 'Error desconocido al generar DER';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [extractedTexts, projectId, projectName, config, onDERGenerated, onError]);

  /**
   * Exporta el DER en el formato especificado
   */
  const exportDER = async (formato) => {
    if (!derData) {
      setError('No hay datos de DER para exportar');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      console.log(`Exportando DER en formato: ${formato}`);

      const response = await aiService.exportDER({
        derData,
        formato,
        motor: config.motor,
        incluirDatos: false,
        incluirComentarios: true
      });

      // Crear blob y descargar
      const blob = new Blob([response], { type: getContentType(formato) });
      const url = URL.createObjectURL(blob);
      const filename = getFilename(formato);

      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = filename;
        downloadLinkRef.current.click();
      }

      // Limpiar URL después de un momento
      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (err) {
      console.error('Error exportando DER:', err);
      setError(err.message || 'Error al exportar DER');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Valida el modelo DER actual
   */
  const validateDER = async () => {
    if (!derData) {
      setError('No hay datos de DER para validar');
      return;
    }

    try {
      const result = await aiService.validateDER({ derData });
      
      if (result.success) {
        // Mostrar resultados de validación
        console.log('Validación completada:', result.data);
        // TODO: Mostrar resultados en un modal o panel
      } else {
        throw new Error(result.error || 'Error en validación');
      }
    } catch (err) {
      console.error('Error validando DER:', err);
      setError(err.message || 'Error al validar DER');
    }
  };

  // Funciones auxiliares
  const getContentType = (formato) => {
    switch (formato) {
      case 'sql': return 'text/sql';
      case 'mermaid': return 'text/plain';
      case 'json': return 'application/json';
      case 'documentation': return 'text/markdown';
      default: return 'text/plain';
    }
  };

  const getFilename = (formato) => {
    const timestamp = Date.now();
    const baseName = projectName ? projectName.replace(/\s+/g, '_') : 'der';
    
    switch (formato) {
      case 'sql': return `${baseName}_schema_${timestamp}.sql`;
      case 'mermaid': return `${baseName}_diagram_${timestamp}.mmd`;
      case 'json': return `${baseName}_model_${timestamp}.json`;
      case 'documentation': return `${baseName}_doc_${timestamp}.md`;
      default: return `${baseName}_export_${timestamp}.txt`;
    }
  };

  // Filtrar entidades según texto de búsqueda
  const filteredEntities = derData?.entidades?.filter(entity =>
    entity.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
    entity.descripcion.toLowerCase().includes(filterText.toLowerCase())
  ) || [];

  // Generar automáticamente si hay textos extraídos
  useEffect(() => {
    if (extractedTexts && extractedTexts.length > 0 && !derData && !isGenerating) {
      generateDER();
    }
  }, [extractedTexts, derData, isGenerating, generateDER]);

  // Generar diagrama Mermaid
  const generateMermaidDiagram = () => {
    if (!derData || !derData.entidades) return '';

    let mermaidCode = 'erDiagram\n';

    // Agregar entidades con atributos
    derData.entidades.forEach(entidad => {
      mermaidCode += `    ${entidad.nombre} {\n`;
      
      entidad.atributos.forEach(attr => {
        const tipo = attr.tipo.toLowerCase();
        const pk = attr.esPK ? ' PK' : '';
        const fk = attr.esFK ? ' FK' : '';
        const nullable = attr.esObligatorio ? '' : ' "nullable"';
        
        mermaidCode += `        ${tipo} ${attr.nombre}${pk}${fk}${nullable}\n`;
      });
      
      mermaidCode += '    }\n';
    });

    // Agregar relaciones
    if (derData.relaciones) {
      derData.relaciones.forEach(rel => {
        const cardinalidad = `${rel.cardinalidadOrigen}${rel.cardinalidadDestino}`;
        mermaidCode += `    ${rel.entidadOrigen} ||--${cardinalidad} ${rel.entidadDestino} : "${rel.nombre}"\n`;
      });
    }

    return mermaidCode;
  };

  return (
    <div className="der-viewer">
      {/* Header con controles */}
      <div className="der-header">
        <div className="der-title">
          <h3>Diagrama de Entidad-Relación</h3>
          {projectName && <span className="project-name">Proyecto: {projectName}</span>}
        </div>

        <div className="der-controls">
          {/* Configuración del motor */}
          <div className="config-group">
            <label htmlFor="motor-select">Motor:</label>
            <select
              id="motor-select"
              value={config.motor}
              onChange={(e) => setConfig(prev => ({ ...prev, motor: e.target.value }))}
              disabled={isGenerating}
            >
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlserver">SQL Server</option>
            </select>
          </div>

          {/* Notación del diagrama */}
          <div className="config-group">
            <label htmlFor="notacion-select">Notación:</label>
            <select
              id="notacion-select"
              value={config.notacion}
              onChange={(e) => setConfig(prev => ({ ...prev, notacion: e.target.value }))}
              disabled={isGenerating}
            >
              <option value="crow_foot">Pata de Gallo</option>
              <option value="chen">Chen</option>
              <option value="bachman">Bachman</option>
              <option value="martin">Martin</option>
              <option value="uml">UML</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="action-buttons">
            <button
              onClick={generateDER}
              disabled={isGenerating || !extractedTexts?.length}
              className="btn btn-primary"
            >
              {isGenerating ? 'Generando...' : 'Generar DER'}
            </button>

            {derData && (
              <>
                <button
                  onClick={validateDER}
                  className="btn btn-secondary"
                  disabled={isGenerating}
                >
                  Validar
                </button>

                <div className="export-dropdown">
                  <button className="btn btn-success dropdown-toggle">
                    {isExporting ? 'Exportando...' : 'Exportar'}
                  </button>
                  <div className="dropdown-menu">
                    <button onClick={() => exportDER('sql')}>SQL Schema</button>
                    <button onClick={() => exportDER('mermaid')}>Mermaid</button>
                    <button onClick={() => exportDER('json')}>JSON</button>
                    <button onClick={() => exportDER('documentation')}>Documentación</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Opciones avanzadas */}
      <div className="advanced-options">
        <details>
          <summary>Opciones Avanzadas</summary>
          <div className="options-grid">
            <label>
              <input
                type="checkbox"
                checked={config.incluirIndices}
                onChange={(e) => setConfig(prev => ({ ...prev, incluirIndices: e.target.checked }))}
              />
              Incluir Índices
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={config.incluirConstraints}
                onChange={(e) => setConfig(prev => ({ ...prev, incluirConstraints: e.target.checked }))}
              />
              Incluir Constraints
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={config.incluirVistas}
                onChange={(e) => setConfig(prev => ({ ...prev, incluirVistas: e.target.checked }))}
              />
              Incluir Vistas
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={config.incluirProcedimientos}
                onChange={(e) => setConfig(prev => ({ ...prev, incluirProcedimientos: e.target.checked }))}
              />
              Incluir Procedimientos
            </label>

            <div className="normalization-select">
              <label htmlFor="normalization">Normalización:</label>
              <select
                id="normalization"
                value={config.nivelNormalizacion}
                onChange={(e) => setConfig(prev => ({ ...prev, nivelNormalizacion: e.target.value }))}
              >
                <option value="1NF">1NF</option>
                <option value="2NF">2NF</option>
                <option value="3NF">3NF</option>
                <option value="BCNF">BCNF</option>
              </select>
            </div>
          </div>
        </details>
      </div>

      {/* Contenido principal */}
      <div className="der-content">
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
            <button onClick={() => setError(null)} className="alert-close">&times;</button>
          </div>
        )}

        {isGenerating && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Analizando documentos y generando modelo de datos...</p>
            <small>Esto puede tomar unos momentos</small>
          </div>
        )}

        {derData && !isGenerating && (
          <>
            {/* Tabs de navegación */}
            <div className="der-tabs">
              <button
                className={`tab ${activeTab === 'diagram' ? 'active' : ''}`}
                onClick={() => setActiveTab('diagram')}
              >
                Diagrama
              </button>
              <button
                className={`tab ${activeTab === 'entities' ? 'active' : ''}`}
                onClick={() => setActiveTab('entities')}
              >
                Entidades ({derData.entidades?.length || 0})
              </button>
              <button
                className={`tab ${activeTab === 'relations' ? 'active' : ''}`}
                onClick={() => setActiveTab('relations')}
              >
                Relaciones ({derData.relaciones?.length || 0})
              </button>
              <button
                className={`tab ${activeTab === 'sql' ? 'active' : ''}`}
                onClick={() => setActiveTab('sql')}
              >
                Scripts SQL
              </button>
            </div>

            {/* Contenido de los tabs */}
            <div className="tab-content">
              {activeTab === 'diagram' && (
                <div className="diagram-tab">
                  <div className="diagram-controls">
                    <label>
                      Vista:
                      <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                      >
                        <option value="mermaid">Mermaid ERD</option>
                        <option value="table">Vista de Tabla</option>
                      </select>
                    </label>
                  </div>

                  {viewMode === 'mermaid' ? (
                    <MermaidViewer
                      chart={generateMermaidDiagram()}
                      title="Diagrama de Entidad-Relación"
                    />
                  ) : (
                    <div className="table-view">
                      {/* Vista tabular de entidades */}
                      <div className="entities-table">
                        <h4>Entidades del Modelo</h4>
                        <div className="table-container">
                          <table className="entities-grid">
                            <thead>
                              <tr>
                                <th>Entidad</th>
                                <th>Tipo</th>
                                <th>Atributos</th>
                                <th>Descripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {derData.entidades?.map((entity, index) => (
                                <tr key={index}>
                                  <td>
                                    <strong>{entity.nombre}</strong>
                                  </td>
                                  <td>
                                    <span className={`entity-type ${entity.tipo}`}>
                                      {entity.tipo}
                                    </span>
                                  </td>
                                  <td>{entity.atributos?.length || 0}</td>
                                  <td>{entity.descripcion}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'entities' && (
                <div className="entities-tab">
                  <div className="entities-header">
                    <input
                      type="text"
                      placeholder="Filtrar entidades..."
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="entities-list">
                    {filteredEntities.map((entity, index) => (
                      <div
                        key={index}
                        className={`entity-card ${
                          selectedEntity === index ? 'selected' : ''
                        }`}
                        onClick={() => setSelectedEntity(
                          selectedEntity === index ? null : index
                        )}
                      >
                        <div className="entity-header">
                          <h4>{entity.nombre}</h4>
                          <span className={`entity-type-badge ${entity.tipo}`}>
                            {entity.tipo}
                          </span>
                        </div>
                        
                        <p className="entity-description">{entity.descripcion}</p>
                        
                        <div className="entity-stats">
                          <span>Atributos: {entity.atributos?.length || 0}</span>
                          <span>Categoría: {entity.categoria}</span>
                        </div>

                        {selectedEntity === index && (
                          <div className="entity-details">
                            <h5>Atributos:</h5>
                            <div className="attributes-list">
                              {entity.atributos?.map((attr, attrIndex) => (
                                <div key={attrIndex} className="attribute-item">
                                  <div className="attribute-header">
                                    <span className="attribute-name">{attr.nombre}</span>
                                    <span className="attribute-type">{attr.tipo}</span>
                                    {attr.esPK && <span className="badge pk">PK</span>}
                                    {attr.esFK && <span className="badge fk">FK</span>}
                                    {attr.esUnico && <span className="badge unique">UNIQUE</span>}
                                  </div>
                                  <p className="attribute-description">{attr.descripcion}</p>
                                </div>
                              ))}
                            </div>

                            {entity.indices && entity.indices.length > 0 && (
                              <>
                                <h5>Índices:</h5>
                                <div className="indices-list">
                                  {entity.indices.map((index, idxIndex) => (
                                    <div key={idxIndex} className="index-item">
                                      <span className="index-name">{index.nombre}</span>
                                      <span className="index-type">{index.tipo}</span>
                                      <span className="index-columns">
                                        [{index.columnas.join(', ')}]
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'relations' && (
                <div className="relations-tab">
                  <div className="relations-list">
                    {derData.relaciones?.map((relation, index) => (
                      <div key={index} className="relation-card">
                        <div className="relation-header">
                          <h4>{relation.nombre}</h4>
                          <span className="cardinality">
                            {relation.cardinalidadOrigen}:{relation.cardinalidadDestino}
                          </span>
                        </div>
                        
                        <div className="relation-entities">
                          <span className="entity">{relation.entidadOrigen}</span>
                          <span className="relation-arrow">→</span>
                          <span className="entity">{relation.entidadDestino}</span>
                        </div>
                        
                        <p className="relation-description">{relation.descripcion}</p>
                        
                        {relation.reglaDeNegocio && (
                          <div className="business-rule">
                            <strong>Regla de Negocio:</strong> {relation.reglaDeNegocio}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'sql' && (
                <div className="sql-tab">
                  {derData.scriptsSQL && Object.keys(derData.scriptsSQL).length > 0 ? (
                    <div className="sql-scripts">
                      {Object.entries(derData.scriptsSQL).map(([scriptType, script]) => (
                        <div key={scriptType} className="sql-script-section">
                          <h4>{scriptType.toUpperCase()}</h4>
                          <div className="sql-code-container">
                            <pre className="sql-code">
                              <code>{script}</code>
                            </pre>
                            <button
                              className="copy-button"
                              onClick={() => navigator.clipboard.writeText(script)}
                            >
                              Copiar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-sql">
                      <p>No hay scripts SQL generados</p>
                      <button onClick={generateDER} className="btn btn-primary">
                        Regenerar con Scripts SQL
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {!derData && !isGenerating && !error && (
          <div className="empty-state">
            <p>No hay datos de DER disponibles</p>
            <button onClick={generateDER} className="btn btn-primary">
              Generar DER
            </button>
          </div>
        )}
      </div>

      {/* Link de descarga oculto */}
      <a
        ref={downloadLinkRef}
        style={{ display: 'none' }}
        href="#"
        download
      >
        Download
      </a>
    </div>
  );
};

DERViewer.propTypes = {
  projectId: PropTypes.string,
  extractedTexts: PropTypes.array.isRequired,
  projectName: PropTypes.string,
  initialConfig: PropTypes.object,
  onDERGenerated: PropTypes.func,
  onError: PropTypes.func
};

export default DERViewer;