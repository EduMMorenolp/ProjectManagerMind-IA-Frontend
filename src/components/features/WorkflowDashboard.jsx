import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { workflowService } from '../../services';

/**
 * Dashboard de Flujo de Trabajo
 * Muestra el progreso, métricas y estado del proyecto con validaciones y aprobaciones
 */
const WorkflowDashboard = ({ 
  projectId, 
  projectName,
  onError,
  refreshInterval = 300000 // 5 minutos
}) => {
  // Estados principales
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Estados específicos
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Carga el dashboard completo
   */
  const loadDashboard = useCallback(async () => {
    if (!projectId) return;

    try {
      setError(null);
      
      const params = {};
      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }

      console.log('Cargando dashboard para proyecto:', projectId);

      const [dashboardResult, availableDocsResult] = await Promise.all([
        workflowService.getProjectDashboard(projectId, params),
        workflowService.getAvailableDocuments(projectId)
      ]);

      if (dashboardResult.success) {
        setDashboardData(dashboardResult.data);
      } else {
        throw new Error(dashboardResult.error || 'Error cargando dashboard');
      }

      if (availableDocsResult.success) {
        setAvailableDocuments(availableDocsResult.data);
      }

    } catch (err) {
      console.error('Error cargando dashboard:', err);
      const errorMessage = err.message || 'Error desconocido al cargar dashboard';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [projectId, dateRange, onError]);

  /**
   * Actualiza el dashboard
   */
  const refreshDashboard = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
  }, [loadDashboard]);

  /**
   * Ejecuta una transición de estado (disponible para uso futuro)
   */
  // eslint-disable-next-line no-unused-vars
  const executeTransition = async (documentId, fromState, toState, reason) => {
    try {
      const result = await workflowService.executeTransition({
        projectId,
        documentId,
        fromState,
        toState,
        userId: 'current_user', // En implementación real obtener del contexto
        reason
      });

      if (result.success) {
        await refreshDashboard();
        return result;
      } else {
        throw new Error(result.error || 'Error ejecutando transición');
      }
    } catch (error) {
      console.error('Error ejecutando transición:', error);
      throw error;
    }
  };

  /**
   * Obtiene el color del estado de salud
   */
  const getHealthColor = (healthScore) => {
    if (healthScore >= 90) return '#4caf50'; // Verde
    if (healthScore >= 75) return '#8bc34a'; // Verde claro
    if (healthScore >= 50) return '#ff9800'; // Naranja
    if (healthScore >= 25) return '#f44336'; // Rojo
    return '#9e9e9e'; // Gris
  };

  /**
   * Obtiene el color del KPI según su estado
   */
  const getKPIColor = (status) => {
    switch (status) {
      case 'excellent': return '#4caf50';
      case 'good': return '#8bc34a';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  // Cargar dashboard al montar y cuando cambie el proyecto
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      loadDashboard();
    }
  }, [projectId, loadDashboard]);

  // Configurar refresh automático
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (!isLoading && !refreshing) {
        refreshDashboard();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, isLoading, refreshing, refreshDashboard]);

  if (isLoading && !dashboardData) {
    return (
      <div className="workflow-dashboard loading">
        <div className="loading-content">
          <div className="spinner large"></div>
          <h3>Cargando Dashboard del Proyecto</h3>
          <p>Analizando progreso y métricas...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="workflow-dashboard error">
        <div className="error-content">
          <h3>Error al cargar Dashboard</h3>
          <p>{error}</p>
          <button onClick={loadDashboard} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="workflow-dashboard empty">
        <div className="empty-content">
          <h3>No hay datos disponibles</h3>
          <p>Selecciona un proyecto para ver su dashboard</p>
        </div>
      </div>
    );
  }

  const { overview, progress, workflow, quality, timeline, recommendations, alerts, kpis } = dashboardData;

  return (
    <div className="workflow-dashboard">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="project-info">
          <h2>{projectName || `Proyecto ${projectId}`}</h2>
          <div className="project-meta">
            <span className="health-indicator" style={{ color: getHealthColor(overview.healthScore) }}>
              ●
            </span>
            <span className="health-score">{overview.healthScore}% Saludable</span>
            <span className="separator">•</span>
            <span className="active-stage">{overview.activeStage}</span>
            <span className="separator">•</span>
            <span className="progress">{overview.overallProgress}% Completado</span>
          </div>
        </div>

        <div className="dashboard-controls">
          {refreshing && <div className="refresh-indicator">⟳ Actualizando...</div>}
          
          <div className="date-range-picker">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              placeholder="Fecha inicio"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              placeholder="Fecha fin"
            />
          </div>

          <button 
            onClick={refreshDashboard} 
            className="btn btn-secondary"
            disabled={refreshing}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Alertas Activas */}
      {alerts && alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`}>
              <div className="alert-content">
                <strong>{alert.title}</strong>
                <p>{alert.message}</p>
                {alert.action && <small>Acción recomendada: {alert.action}</small>}
              </div>
              <div className="alert-timestamp">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs Principales */}
      <div className="kpis-section">
        <div className="kpis-grid">
          {kpis && Object.entries(kpis).map(([kpiName, kpiData]) => (
            <div key={kpiName} className="kpi-card">
              <div className="kpi-header">
                <h4>{kpiName.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div className="kpi-trend">
                  {kpiData.trend === 'up' && '📈'}
                  {kpiData.trend === 'down' && '📉'}
                  {kpiData.trend === 'stable' && '➡️'}
                </div>
              </div>
              <div className="kpi-value" style={{ color: getKPIColor(kpiData.status) }}>
                {typeof kpiData.value === 'number' ? 
                  `${Math.round(kpiData.value)}${kpiName.includes('velocity') ? 'x' : '%'}` : 
                  kpiData.value
                }
              </div>
              <div className={`kpi-status ${kpiData.status}`}>
                {kpiData.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navegación por Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Resumen
        </button>
        <button
          className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          📈 Progreso
        </button>
        <button
          className={`tab ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          🔄 Flujo
        </button>
        <button
          className={`tab ${activeTab === 'quality' ? 'active' : ''}`}
          onClick={() => setActiveTab('quality')}
        >
          ✅ Calidad
        </button>
        <button
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          ⏱️ Timeline
        </button>
      </div>

      {/* Contenido de los Tabs */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              {/* Progreso General */}
              <div className="overview-card">
                <h3>Progreso General</h3>
                <div className="progress-circle">
                  <div className="circle-progress" style={{
                    background: `conic-gradient(#1976d2 ${overview.overallProgress * 3.6}deg, #e0e0e0 0deg)`
                  }}>
                    <div className="circle-inner">
                      <span className="progress-text">{overview.overallProgress}%</span>
                    </div>
                  </div>
                </div>
                <div className="overview-stats">
                  <div className="stat">
                    <span className="stat-value">{overview.completedDocuments}</span>
                    <span className="stat-label">Completados</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{overview.pendingDocuments}</span>
                    <span className="stat-label">Pendientes</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{overview.blockers}</span>
                    <span className="stat-label">Bloqueadores</span>
                  </div>
                </div>
              </div>

              {/* Documentos Disponibles */}
              <div className="overview-card">
                <h3>Próximos Pasos</h3>
                <div className="available-documents">
                  {availableDocuments.slice(0, 5).map((doc, index) => (
                    <div key={index} className="available-doc">
                      <div className="doc-info">
                        <span className="doc-type">{doc.type}</span>
                        <span className="doc-stage">{doc.stage}</span>
                      </div>
                      <div className="doc-meta">
                        <span className="doc-time">~{doc.estimatedTime}min</span>
                        {doc.required && <span className="required-badge">Requerido</span>}
                      </div>
                    </div>
                  ))}
                  {availableDocuments.length === 0 && (
                    <p className="no-documents">No hay documentos disponibles para crear</p>
                  )}
                </div>
              </div>

              {/* Recomendaciones */}
              <div className="overview-card">
                <h3>Recomendaciones</h3>
                <div className="recommendations">
                  {recommendations && recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className={`recommendation ${rec.priority}`}>
                      <div className="rec-header">
                        <span className="rec-title">{rec.title}</span>
                        <span className={`rec-priority ${rec.priority}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="rec-description">{rec.description}</p>
                      {rec.action && (
                        <small className="rec-action">💡 {rec.action}</small>
                      )}
                    </div>
                  ))}
                  {(!recommendations || recommendations.length === 0) && (
                    <p className="no-recommendations">¡Excelente! No hay recomendaciones pendientes</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && progress && (
          <div className="progress-tab">
            <div className="stages-progress">
              <h3>Progreso por Etapas</h3>
              <div className="stages-grid">
                {Object.entries(progress.stages).map(([stageName, stageData]) => (
                  <div key={stageName} className="stage-card">
                    <div className="stage-header">
                      <h4>{stageName}</h4>
                      <span className="stage-percentage">{stageData.completionPercentage}%</span>
                    </div>
                    <div className="stage-progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${stageData.completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="stage-stats">
                      <span>{stageData.completedDocuments}/{stageData.totalDocuments} docs</span>
                      {stageData.canProceedToNext ? (
                        <span className="status-badge complete">✅ Lista</span>
                      ) : (
                        <span className="status-badge pending">⏳ En progreso</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Velocity y Burndown */}
            {progress.velocity && (
              <div className="velocity-section">
                <h3>Velocidad del Proyecto</h3>
                <div className="velocity-card">
                  <div className="velocity-current">
                    <span className="velocity-value">{progress.velocity.current}x</span>
                    <span className="velocity-label">Velocidad Actual</span>
                  </div>
                  <div className="velocity-trend">
                    Tendencia: <span className={`trend ${progress.velocity.trend}`}>
                      {progress.velocity.trend}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && workflow && (
          <div className="workflow-tab">
            <div className="workflow-metrics">
              <h3>Métricas de Flujo de Trabajo</h3>
              <div className="workflow-grid">
                <div className="workflow-card">
                  <h4>Transiciones</h4>
                  <div className="metric-value">{workflow.totalTransitions}</div>
                  <div className="metric-detail">
                    <span>🤖 {workflow.automatedTransitions} automáticas</span>
                    <span>👤 {workflow.manualTransitions} manuales</span>
                  </div>
                </div>

                <div className="workflow-card">
                  <h4>Distribución de Estados</h4>
                  <div className="state-distribution">
                    {Object.entries(workflow.stateDistribution).map(([state, count]) => (
                      <div key={state} className="state-item">
                        <span className="state-name">{state}</span>
                        <span className="state-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {workflow.bottlenecks && workflow.bottlenecks.length > 0 && (
                  <div className="workflow-card">
                    <h4>Cuellos de Botella</h4>
                    <div className="bottlenecks">
                      {workflow.bottlenecks.map((bottleneck, index) => (
                        <div key={index} className="bottleneck-item">
                          <span className="bottleneck-name">{bottleneck.name}</span>
                          <span className="bottleneck-impact">{bottleneck.impact}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && quality && (
          <div className="quality-tab">
            <div className="quality-metrics">
              <h3>Métricas de Calidad</h3>
              <div className="quality-grid">
                <div className="quality-card">
                  <h4>Tasa de Aprobación</h4>
                  <div className="metric-value">{Math.round(quality.approvalRate * 100)}%</div>
                  <div className="quality-indicator" style={{
                    color: quality.approvalRate > 0.8 ? '#4caf50' : 
                           quality.approvalRate > 0.6 ? '#ff9800' : '#f44336'
                  }}>
                    {quality.approvalRate > 0.8 ? '✅ Excelente' :
                     quality.approvalRate > 0.6 ? '⚠️ Aceptable' : '❌ Necesita mejora'}
                  </div>
                </div>

                <div className="quality-card">
                  <h4>Puntuación de Calidad</h4>
                  <div className="metric-value">{quality.qualityScore}/100</div>
                  <div className="quality-bar">
                    <div 
                      className="quality-fill"
                      style={{ 
                        width: `${quality.qualityScore}%`,
                        backgroundColor: quality.qualityScore > 80 ? '#4caf50' : 
                                       quality.qualityScore > 60 ? '#ff9800' : '#f44336'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="quality-card">
                  <h4>Densidad de Defectos</h4>
                  <div className="metric-value">{quality.defectDensity}</div>
                  <div className="metric-detail">
                    Defectos por documento
                  </div>
                </div>

                {quality.commentDistribution && (
                  <div className="quality-card">
                    <h4>Tipos de Comentarios</h4>
                    <div className="comment-distribution">
                      {Object.entries(quality.commentDistribution).map(([type, count]) => (
                        <div key={type} className="comment-type">
                          <span className="comment-name">{type}</span>
                          <span className="comment-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && timeline && (
          <div className="timeline-tab">
            <div className="timeline-content">
              <h3>Timeline del Proyecto</h3>
              
              {timeline.plannedTimeline && timeline.plannedTimeline.length > 0 && (
                <div className="timeline-chart">
                  {timeline.plannedTimeline.map((stage, index) => (
                    <div key={index} className="timeline-stage">
                      <div className="stage-name">{stage.stage}</div>
                      <div className="stage-timeline">
                        <div className="timeline-bar">
                          <div 
                            className="planned-bar"
                            style={{ width: `${stage.estimatedDuration / 10}px` }}
                          ></div>
                        </div>
                        <div className="stage-duration">
                          {Math.round(stage.estimatedDuration / 60)}h estimadas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {timeline.upcomingDeadlines && timeline.upcomingDeadlines.length > 0 && (
                <div className="upcoming-deadlines">
                  <h4>Próximos Vencimientos</h4>
                  {timeline.upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="deadline-item">
                      <span className="deadline-task">{deadline.task}</span>
                      <span className="deadline-date">{deadline.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

WorkflowDashboard.propTypes = {
  projectId: PropTypes.string.isRequired,
  projectName: PropTypes.string,
  onError: PropTypes.func,
  refreshInterval: PropTypes.number
};

export default WorkflowDashboard;