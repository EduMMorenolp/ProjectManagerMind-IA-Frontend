import React, { useState, useCallback } from 'react';
import { generateSprintPlanning, exportSprintPlanning } from '../../../services/aiService';
import { PlayIcon, DownloadIcon, ChevronDownIcon, ChevronRightIcon, CalendarIcon, UsersIcon, ClockIcon } from '../../ui/Icons';

const SprintPlanningViewer = ({ projectId, onError, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [planningData, setPlanningData] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    configuracion: false,
    resumen: true,
    sprints: true,
    metricas: true,
    cronograma: false
  });
  const [exporting, setExporting] = useState(false);

  // Configuración por defecto
  const [config, setConfig] = useState({
    duracionSprint: 14,
    capacidadEquipo: 40,
    miembrosEquipo: 5,
    horasPorDia: 8,
    factorBuffering: 0.8,
    experiencia: 'intermedio',
    prioridadAutomatica: true
  });

  const handleGenerate = async () => {
    if (!projectId) {
      onError?.('No se ha seleccionado un proyecto');
      return;
    }

    setLoading(true);
    try {
      const result = await generateSprintPlanning(projectId, config);
      
      if (result.success) {
        setPlanningData(result.data);
        setSelectedSprint(0);
        onSuccess?.('Planificación de sprints generada exitosamente');
      } else {
        throw new Error(result.message || 'Error al generar planificación');
      }
    } catch (error) {
      console.error('Error generando planificación:', error);
      onError?.(error.message || 'Error al generar la planificación de sprints');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = useCallback(async (formato) => {
    if (!planningData?.processedResultId) {
      onError?.('No hay planificación para exportar');
      return;
    }

    setExporting(true);
    try {
      await exportSprintPlanning(planningData.processedResultId, formato);
      onSuccess?.(`Planificación exportada en formato ${formato.toUpperCase()}`);
    } catch (error) {
      console.error('Error exportando:', error);
      onError?.('Error al exportar la planificación');
    } finally {
      setExporting(false);
    }
  }, [planningData, onError, onSuccess]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      'alta': '#dc2626',
      'high': '#dc2626',
      'media': '#f59e0b',
      'medium': '#f59e0b',
      'baja': '#10b981',
      'low': '#10b981'
    };
    return colors[prioridad?.toLowerCase()] || '#6b7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const currentSprints = planningData?.planificacion?.sprints || [];
  const currentSprint = currentSprints[selectedSprint];

  return (
    <div className="sprint-planning-viewer">
      <div className="viewer-header">
        <h3>📅 Planificación de Sprints</h3>
        <p className="viewer-description">
          Genera planificación automática de sprints basada en historias de usuario
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
          <h4>⚙️ Configuración de Sprints</h4>
        </div>
        
        {expandedSections.configuracion && (
          <div className="config-content">
            <div className="config-grid">
              <div className="config-section">
                <h5>📅 Configuración de Sprint</h5>
                <div className="config-row">
                  <div className="config-field">
                    <label>Duración del Sprint (días):</label>
                    <input
                      type="number"
                      min="7"
                      max="30"
                      value={config.duracionSprint}
                      onChange={(e) => setConfig(prev => ({ ...prev, duracionSprint: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="config-field">
                    <label>Factor de Buffering:</label>
                    <select 
                      value={config.factorBuffering}
                      onChange={(e) => setConfig(prev => ({ ...prev, factorBuffering: parseFloat(e.target.value) }))}
                    >
                      <option value={0.7}>70% (Conservador)</option>
                      <option value={0.8}>80% (Recomendado)</option>
                      <option value={0.9}>90% (Agresivo)</option>
                      <option value={1.0}>100% (Sin buffer)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h5>👥 Configuración del Equipo</h5>
                <div className="config-row">
                  <div className="config-field">
                    <label>Miembros del Equipo:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={config.miembrosEquipo}
                      onChange={(e) => setConfig(prev => ({ ...prev, miembrosEquipo: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="config-field">
                    <label>Capacidad (Story Points):</label>
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={config.capacidadEquipo}
                      onChange={(e) => setConfig(prev => ({ ...prev, capacidadEquipo: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="config-row">
                  <div className="config-field">
                    <label>Horas por Día:</label>
                    <select 
                      value={config.horasPorDia}
                      onChange={(e) => setConfig(prev => ({ ...prev, horasPorDia: parseInt(e.target.value) }))}
                    >
                      <option value={6}>6 horas</option>
                      <option value={7}>7 horas</option>
                      <option value={8}>8 horas</option>
                    </select>
                  </div>
                  <div className="config-field">
                    <label>Experiencia del Equipo:</label>
                    <select 
                      value={config.experiencia}
                      onChange={(e) => setConfig(prev => ({ ...prev, experiencia: e.target.value }))}
                    >
                      <option value="junior">Junior</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <div className="config-field checkbox-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={config.prioridadAutomatica}
                      onChange={(e) => setConfig(prev => ({ ...prev, prioridadAutomatica: e.target.checked }))}
                    />
                    Asignar prioridades automáticamente
                  </label>
                </div>
              </div>
            </div>

            <div className="generate-section">
              <button 
                className="generate-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Generando Planificación...
                  </>
                ) : (
                  <>
                    <PlayIcon className="button-icon" />
                    Generar Planificación de Sprints
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resultados */}
      {planningData && (
        <>
          {/* Resumen Ejecutivo */}
          <div className="results-panel">
            <div 
              className="results-header"
              onClick={() => toggleSection('resumen')}
            >
              {expandedSections.resumen ? 
                <ChevronDownIcon className="toggle-icon" /> : 
                <ChevronRightIcon className="toggle-icon" />
              }
              <h4>📊 Resumen Ejecutivo</h4>
            </div>
            
            {expandedSections.resumen && (
              <div className="results-content">
                <div className="summary-cards">
                  <div className="summary-card">
                    <div className="card-icon">📅</div>
                    <div className="card-content">
                      <h5>Total Sprints</h5>
                      <p>{planningData.planificacion.totalSprints}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon">⏱️</div>
                    <div className="card-content">
                      <h5>Duración Total</h5>
                      <p>{planningData.planificacion.duracionTotal}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon">📈</div>
                    <div className="card-content">
                      <h5>Velocidad Estimada</h5>
                      <p>{planningData.metricas.velocidadPromedio} SP</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon">⚡</div>
                    <div className="card-content">
                      <h5>Eficiencia</h5>
                      <p>{planningData.metricas.eficiencia}</p>
                    </div>
                  </div>
                </div>

                <div className="executive-summary">
                  <h6>📋 Resumen:</h6>
                  <p>{planningData.planificacion.resumenEjecutivo}</p>
                </div>

                {planningData.recomendaciones && planningData.recomendaciones.length > 0 && (
                  <div className="recommendations">
                    <h6>💡 Recomendaciones:</h6>
                    <ul>
                      {planningData.recomendaciones.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sprints */}
          <div className="sprints-panel">
            <div 
              className="sprints-header"
              onClick={() => toggleSection('sprints')}
            >
              {expandedSections.sprints ? 
                <ChevronDownIcon className="toggle-icon" /> : 
                <ChevronRightIcon className="toggle-icon" />
              }
              <h4>🏃‍♂️ Sprints Planificados</h4>
              <div className="export-buttons">
                <button
                  className="export-button"
                  onClick={() => handleExport('json')}
                  disabled={exporting}
                  title="Exportar como JSON"
                >
                  <DownloadIcon className="button-icon" />
                  JSON
                </button>
                <button
                  className="export-button"
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                  title="Exportar como CSV"
                >
                  <DownloadIcon className="button-icon" />
                  CSV
                </button>
                <button
                  className="export-button"
                  onClick={() => handleExport('jira')}
                  disabled={exporting}
                  title="Exportar para Jira"
                >
                  <DownloadIcon className="button-icon" />
                  Jira
                </button>
              </div>
            </div>
            
            {expandedSections.sprints && (
              <div className="sprints-content">
                {/* Selector de Sprint */}
                <div className="sprint-selector">
                  {currentSprints.map((sprint, idx) => (
                    <button
                      key={idx}
                      className={`sprint-tab ${selectedSprint === idx ? 'active' : ''}`}
                      onClick={() => setSelectedSprint(idx)}
                    >
                      <div className="sprint-tab-content">
                        <span className="sprint-name">{sprint.nombre}</span>
                        <span className="sprint-points">{sprint.totalStoryPoints} SP</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Detalle del Sprint Seleccionado */}
                {currentSprint && (
                  <div className="sprint-detail">
                    <div className="sprint-header">
                      <h5>{currentSprint.nombre}</h5>
                      <div className="sprint-meta">
                        <span className="sprint-dates">
                          <CalendarIcon className="meta-icon" />
                          {formatDate(currentSprint.fechaInicio)} - {formatDate(currentSprint.fechaFin)}
                        </span>
                        <span className="sprint-duration">
                          <ClockIcon className="meta-icon" />
                          {currentSprint.duracion} días
                        </span>
                        <span className="sprint-points">
                          <UsersIcon className="meta-icon" />
                          {currentSprint.totalStoryPoints} SP
                        </span>
                      </div>
                    </div>

                    <div className="sprint-objective">
                      <h6>🎯 Objetivo del Sprint:</h6>
                      <p>{currentSprint.objetivo}</p>
                    </div>

                    <div className="sprint-stories">
                      <h6>📝 Historias de Usuario ({currentSprint.historias.length}):</h6>
                      <div className="stories-list">
                        {currentSprint.historias.map((historia, idx) => (
                          <div key={idx} className="story-card">
                            <div className="story-header">
                              <span className="story-id">{historia.id}</span>
                              <span 
                                className="story-priority"
                                style={{ color: getPrioridadColor(historia.prioridad) }}
                              >
                                {historia.prioridad}
                              </span>
                              <span className="story-points">{historia.storyPoints} SP</span>
                            </div>
                            <h6 className="story-title">{historia.titulo}</h6>
                            <p className="story-description">{historia.descripcion}</p>
                            
                            {historia.criteriosAceptacion && historia.criteriosAceptacion.length > 0 && (
                              <div className="acceptance-criteria">
                                <strong>Criterios de Aceptación:</strong>
                                <ul>
                                  {historia.criteriosAceptacion.map((criterio, cIdx) => (
                                    <li key={cIdx}>{criterio}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {historia.dependencias && historia.dependencias.length > 0 && (
                              <div className="story-dependencies">
                                <strong>Dependencias:</strong> {historia.dependencias.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentSprint.hitos && currentSprint.hitos.length > 0 && (
                      <div className="sprint-milestones">
                        <h6>🏁 Hitos:</h6>
                        <ul>
                          {currentSprint.hitos.map((hito, idx) => (
                            <li key={idx}>{hito}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentSprint.riesgos && currentSprint.riesgos.length > 0 && (
                      <div className="sprint-risks">
                        <h6>⚠️ Riesgos Identificados:</h6>
                        <ul>
                          {currentSprint.riesgos.map((riesgo, idx) => (
                            <li key={idx}>{riesgo}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Métricas */}
          <div className="metrics-panel">
            <div 
              className="metrics-header"
              onClick={() => toggleSection('metricas')}
            >
              {expandedSections.metricas ? 
                <ChevronDownIcon className="toggle-icon" /> : 
                <ChevronRightIcon className="toggle-icon" />
              }
              <h4>📈 Métricas del Proyecto</h4>
            </div>
            
            {expandedSections.metricas && (
              <div className="metrics-content">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h6>📊 Story Points Totales</h6>
                    <div className="metric-value">{planningData.metricas.totalStoryPoints}</div>
                  </div>
                  <div className="metric-card">
                    <h6>⏰ Horas Estimadas</h6>
                    <div className="metric-value">{planningData.metricas.totalHoras}h</div>
                  </div>
                  <div className="metric-card">
                    <h6>🚀 Velocidad Promedio</h6>
                    <div className="metric-value">{planningData.metricas.velocidadPromedio} SP</div>
                  </div>
                  <div className="metric-card">
                    <h6>📋 Capacidad Utilizada</h6>
                    <div className="metric-value">{planningData.metricas.capacidadUtilizada}%</div>
                  </div>
                </div>

                {planningData.metricas.distribucionPrioridades && (
                  <div className="priority-distribution">
                    <h6>🎯 Distribución de Prioridades:</h6>
                    <div className="priority-bars">
                      <div className="priority-bar">
                        <span className="priority-label">Alta:</span>
                        <div className="bar-container">
                          <div 
                            className="bar high-priority" 
                            style={{ width: `${(planningData.metricas.distribucionPrioridades.alta / (planningData.metricas.distribucionPrioridades.alta + planningData.metricas.distribucionPrioridades.media + planningData.metricas.distribucionPrioridades.baja)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="priority-count">{planningData.metricas.distribucionPrioridades.alta}</span>
                      </div>
                      <div className="priority-bar">
                        <span className="priority-label">Media:</span>
                        <div className="bar-container">
                          <div 
                            className="bar medium-priority" 
                            style={{ width: `${(planningData.metricas.distribucionPrioridades.media / (planningData.metricas.distribucionPrioridades.alta + planningData.metricas.distribucionPrioridades.media + planningData.metricas.distribucionPrioridades.baja)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="priority-count">{planningData.metricas.distribucionPrioridades.media}</span>
                      </div>
                      <div className="priority-bar">
                        <span className="priority-label">Baja:</span>
                        <div className="bar-container">
                          <div 
                            className="bar low-priority" 
                            style={{ width: `${(planningData.metricas.distribucionPrioridades.baja / (planningData.metricas.distribucionPrioridades.alta + planningData.metricas.distribucionPrioridades.media + planningData.metricas.distribucionPrioridades.baja)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="priority-count">{planningData.metricas.distribucionPrioridades.baja}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cronograma */}
          {planningData.cronograma && (
            <div className="timeline-panel">
              <div 
                className="timeline-header"
                onClick={() => toggleSection('cronograma')}
              >
                {expandedSections.cronograma ? 
                  <ChevronDownIcon className="toggle-icon" /> : 
                  <ChevronRightIcon className="toggle-icon" />
                }
                <h4>📅 Cronograma del Proyecto</h4>
              </div>
              
              {expandedSections.cronograma && (
                <div className="timeline-content">
                  <div className="timeline-summary">
                    <p><strong>Inicio:</strong> {formatDate(planningData.cronograma.fechaInicio)}</p>
                    <p><strong>Fin:</strong> {formatDate(planningData.cronograma.fechaFin)}</p>
                    <p><strong>Duración:</strong> {planningData.cronograma.duracionTotal} días</p>
                  </div>

                  {planningData.cronograma.hitos && planningData.cronograma.hitos.length > 0 && (
                    <div className="timeline-milestones">
                      <h6>🏁 Hitos del Proyecto:</h6>
                      <div className="milestones-list">
                        {planningData.cronograma.hitos.map((hito, idx) => (
                          <div key={idx} className="milestone-item">
                            <div className="milestone-date">{formatDate(hito.fecha)}</div>
                            <div className="milestone-content">
                              <h6>{hito.tipo}</h6>
                              <p>{hito.descripcion}</p>
                              {hito.entregables && hito.entregables.length > 0 && (
                                <ul className="milestone-deliverables">
                                  {hito.entregables.map((entregable, eIdx) => (
                                    <li key={eIdx}>{entregable}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!planningData && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h4>Genera Planificación de Sprints</h4>
          <p>
            Configura los parámetros del equipo y genera una planificación automática de sprints 
            basada en las historias de usuario de tu proyecto.
          </p>
        </div>
      )}
    </div>
  );
};

export default SprintPlanningViewer;