import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { workflowService } from '../../services';

/**
 * Panel de Validaciones
 * Muestra el estado de validación de prerequisitos y permite ejecutar validaciones manuales
 */
const ValidationPanel = ({ 
  projectId,
  documentId = null,
  stage = null,
  onValidationComplete,
  onError,
  showStageValidation = true,
  showDocumentValidation = true, // eslint-disable-line no-unused-vars
  autoRefresh = true,
  refreshInterval = 30000 // 30 segundos
}) => {
  // Estados principales
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState(null);
  const [lastValidated, setLastValidated] = useState(null);

  // Estados específicos
  const [selectedStage, setSelectedStage] = useState(stage || 'PRELIMINAR');
  const [expandedSections, setExpandedSections] = useState(new Set(['summary']));

  /**
   * Ejecuta la validación de prerequisitos
   */
  const runValidation = useCallback(async (targetDocumentId = null, targetStage = null) => {
    if (!projectId) return;

    try {
      setIsValidating(true);
      setError(null);

      console.log('Ejecutando validación:', {
        projectId,
        documentId: targetDocumentId || documentId,
        stage: targetStage || selectedStage
      });

      const result = await workflowService.validatePrerequisites(
        projectId,
        targetDocumentId || documentId,
        targetStage || selectedStage
      );

      if (result.success) {
        setValidationResults(result.data);
        setLastValidated(new Date());
        
        if (onValidationComplete) {
          onValidationComplete(result.data);
        }
      } else {
        throw new Error(result.error || 'Error en validación');
      }

    } catch (err) {
      console.error('Error en validación:', err);
      const errorMessage = err.message || 'Error desconocido en validación';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsValidating(false);
    }
  }, [projectId, documentId, selectedStage, onValidationComplete, onError]);

  /**
   * Alterna la expansión de una sección
   */
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName);
      } else {
        newSet.add(sectionName);
      }
      return newSet;
    });
  };

  /**
   * Obtiene el color del estado de validación (disponible para uso futuro)
   */
  // eslint-disable-next-line no-unused-vars
  const getValidationColor = (isValid, hasWarnings = false) => {
    if (isValid && !hasWarnings) return '#27ae60'; // Verde
    if (isValid && hasWarnings) return '#f39c12'; // Naranja
    return '#e74c3c'; // Rojo
  };

  /**
   * Obtiene el icono del estado
   */
  const getStatusIcon = (isValid, hasWarnings = false) => {
    if (isValid && !hasWarnings) return '✅';
    if (isValid && hasWarnings) return '⚠️';
    return '❌';
  };

  // Validación inicial y auto-refresh
  useEffect(() => {
    if (projectId) {
      runValidation();
    }
  }, [projectId, runValidation]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      if (!isValidating) {
        runValidation();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isValidating, runValidation]);

  if (!projectId) {
    return (
      <div className="validation-panel empty">
        <div className="empty-content">
          <h3>Panel de Validación</h3>
          <p>Selecciona un proyecto para ver las validaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-panel">
      {/* Header del Panel */}
      <div className="validation-header">
        <div className="panel-title">
          <h3>🔍 Validación de Prerequisitos</h3>
          {lastValidated && (
            <div className="last-validated">
              Última validación: {lastValidated.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="validation-controls">
          {showStageValidation && (
            <div className="stage-selector">
              <label htmlFor="stage-select">Etapa:</label>
              <select
                id="stage-select"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                disabled={isValidating}
              >
                <option value="PRELIMINAR">Preliminar</option>
                <option value="ANALISIS">Análisis</option>
                <option value="DISENO">Diseño</option>
              </select>
            </div>
          )}

          <button
            onClick={() => runValidation()}
            disabled={isValidating}
            className="btn btn-primary validation-btn"
          >
            {isValidating ? (
              <>
                <div className="spinner small"></div>
                Validando...
              </>
            ) : (
              <>
                🔄 Validar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="validation-error">
          <div className="error-content">
            <strong>Error en Validación</strong>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="btn btn-secondary btn-small"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isValidating && !validationResults && (
        <div className="validation-loading">
          <div className="loading-content">
            <div className="spinner"></div>
            <h4>Ejecutando Validación</h4>
            <p>Verificando prerequisitos y dependencias...</p>
          </div>
        </div>
      )}

      {/* Validation Results */}
      {validationResults && (
        <div className="validation-results">
          {/* Resumen General */}
          <div className="validation-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('summary')}
            >
              <div className="section-title">
                <span className="expand-icon">
                  {expandedSections.has('summary') ? '🔽' : '▶️'}
                </span>
                <h4>Resumen General</h4>
                <div className="validation-status">
                  {getStatusIcon(
                    validationResults.canProceed,
                    validationResults.warnings?.length > 0
                  )}
                  <span className={`status-text ${validationResults.canProceed ? 'valid' : 'invalid'}`}>
                    {validationResults.canProceed ? 'Válido' : 'Bloqueado'}
                  </span>
                </div>
              </div>
            </div>

            {expandedSections.has('summary') && (
              <div className="section-content">
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon">📋</div>
                    <div className="summary-info">
                      <div className="summary-value">
                        {validationResults.satisfiedPrerequisites || 0}
                      </div>
                      <div className="summary-label">Prerequisitos Cumplidos</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">⚠️</div>
                    <div className="summary-info">
                      <div className="summary-value">
                        {validationResults.missingPrerequisites?.length || 0}
                      </div>
                      <div className="summary-label">Faltantes</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">🔒</div>
                    <div className="summary-info">
                      <div className="summary-value">
                        {validationResults.blockers?.length || 0}
                      </div>
                      <div className="summary-label">Bloqueadores</div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">💡</div>
                    <div className="summary-info">
                      <div className="summary-value">
                        {validationResults.warnings?.length || 0}
                      </div>
                      <div className="summary-label">Advertencias</div>
                    </div>
                  </div>
                </div>

                {validationResults.overallMessage && (
                  <div className="overall-message">
                    <p>{validationResults.overallMessage}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prerequisitos Faltantes */}
          {validationResults.missingPrerequisites?.length > 0 && (
            <div className="validation-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('missing')}
              >
                <div className="section-title">
                  <span className="expand-icon">
                    {expandedSections.has('missing') ? '🔽' : '▶️'}
                  </span>
                  <h4>Prerequisitos Faltantes</h4>
                  <div className="section-badge error">
                    {validationResults.missingPrerequisites.length}
                  </div>
                </div>
              </div>

              {expandedSections.has('missing') && (
                <div className="section-content">
                  <div className="missing-prerequisites">
                    {validationResults.missingPrerequisites.map((prereq, index) => (
                      <div key={index} className="prerequisite-item missing">
                        <div className="prereq-header">
                          <div className="prereq-info">
                            <div className="prereq-type">{prereq.documentType}</div>
                            <div className="prereq-stage">{prereq.stage}</div>
                          </div>
                          <div className="prereq-status error">❌ Faltante</div>
                        </div>
                        <div className="prereq-description">
                          {prereq.description || `Documento ${prereq.documentType} requerido para la etapa ${prereq.stage}`}
                        </div>
                        {prereq.estimatedTime && (
                          <div className="prereq-time">
                            ⏱️ Tiempo estimado: {prereq.estimatedTime} minutos
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bloqueadores */}
          {validationResults.blockers?.length > 0 && (
            <div className="validation-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('blockers')}
              >
                <div className="section-title">
                  <span className="expand-icon">
                    {expandedSections.has('blockers') ? '🔽' : '▶️'}
                  </span>
                  <h4>Bloqueadores Críticos</h4>
                  <div className="section-badge critical">
                    {validationResults.blockers.length}
                  </div>
                </div>
              </div>

              {expandedSections.has('blockers') && (
                <div className="section-content">
                  <div className="blockers-list">
                    {validationResults.blockers.map((blocker, index) => (
                      <div key={index} className="blocker-item">
                        <div className="blocker-header">
                          <div className="blocker-title">🚫 {blocker.title}</div>
                          <div className="blocker-severity">
                            {blocker.severity || 'high'}
                          </div>
                        </div>
                        <div className="blocker-description">
                          {blocker.description}
                        </div>
                        {blocker.resolution && (
                          <div className="blocker-resolution">
                            <strong>Resolución:</strong> {blocker.resolution}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Advertencias */}
          {validationResults.warnings?.length > 0 && (
            <div className="validation-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('warnings')}
              >
                <div className="section-title">
                  <span className="expand-icon">
                    {expandedSections.has('warnings') ? '🔽' : '▶️'}
                  </span>
                  <h4>Advertencias</h4>
                  <div className="section-badge warning">
                    {validationResults.warnings.length}
                  </div>
                </div>
              </div>

              {expandedSections.has('warnings') && (
                <div className="section-content">
                  <div className="warnings-list">
                    {validationResults.warnings.map((warning, index) => (
                      <div key={index} className="warning-item">
                        <div className="warning-header">
                          <div className="warning-title">⚠️ {warning.title}</div>
                          <div className="warning-type">{warning.type}</div>
                        </div>
                        <div className="warning-message">
                          {warning.message}
                        </div>
                        {warning.suggestion && (
                          <div className="warning-suggestion">
                            <strong>Sugerencia:</strong> {warning.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prerequisitos Satisfechos */}
          {validationResults.satisfiedPrerequisites?.length > 0 && (
            <div className="validation-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('satisfied')}
              >
                <div className="section-title">
                  <span className="expand-icon">
                    {expandedSections.has('satisfied') ? '🔽' : '▶️'}
                  </span>
                  <h4>Prerequisitos Cumplidos</h4>
                  <div className="section-badge success">
                    {validationResults.satisfiedPrerequisites.length}
                  </div>
                </div>
              </div>

              {expandedSections.has('satisfied') && (
                <div className="section-content">
                  <div className="satisfied-prerequisites">
                    {validationResults.satisfiedPrerequisites.map((prereq, index) => (
                      <div key={index} className="prerequisite-item satisfied">
                        <div className="prereq-header">
                          <div className="prereq-info">
                            <div className="prereq-type">{prereq.documentType}</div>
                            <div className="prereq-stage">{prereq.stage}</div>
                          </div>
                          <div className="prereq-status success">✅ Cumplido</div>
                        </div>
                        {prereq.completedAt && (
                          <div className="prereq-completed">
                            Completado: {new Date(prereq.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Próximos Pasos */}
          {validationResults.nextSteps?.length > 0 && (
            <div className="validation-section">
              <div 
                className="section-header"
                onClick={() => toggleSection('nextSteps')}
              >
                <div className="section-title">
                  <span className="expand-icon">
                    {expandedSections.has('nextSteps') ? '🔽' : '▶️'}
                  </span>
                  <h4>Próximos Pasos</h4>
                  <div className="section-badge info">
                    {validationResults.nextSteps.length}
                  </div>
                </div>
              </div>

              {expandedSections.has('nextSteps') && (
                <div className="section-content">
                  <div className="next-steps">
                    {validationResults.nextSteps.map((step, index) => (
                      <div key={index} className="next-step">
                        <div className="step-number">{index + 1}</div>
                        <div className="step-content">
                          <div className="step-title">{step.title}</div>
                          <div className="step-description">{step.description}</div>
                          {step.priority && (
                            <div className={`step-priority ${step.priority}`}>
                              Prioridad: {step.priority}
                            </div>
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

      {/* Estado Vacío */}
      {!isValidating && !validationResults && !error && (
        <div className="validation-empty">
          <div className="empty-content">
            <div className="empty-icon">🔍</div>
            <h4>Sin Validaciones</h4>
            <p>Haz clic en "Validar" para verificar los prerequisitos</p>
          </div>
        </div>
      )}
    </div>
  );
};

ValidationPanel.propTypes = {
  projectId: PropTypes.string.isRequired,
  documentId: PropTypes.string,
  stage: PropTypes.oneOf(['PRELIMINAR', 'ANALISIS', 'DISENO']),
  onValidationComplete: PropTypes.func,
  onError: PropTypes.func,
  showStageValidation: PropTypes.bool,
  showDocumentValidation: PropTypes.bool,
  autoRefresh: PropTypes.bool,
  refreshInterval: PropTypes.number
};

export default ValidationPanel;