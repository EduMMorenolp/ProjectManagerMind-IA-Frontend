import React, { useState, useEffect } from 'react';
import { PlayIcon, CheckIcon, XIcon, AlertTriangleIcon } from '../../../ui/Icons';
import { projectService } from '../../../../services';

const InformeSection = ({ 
  projectId, 
  clientInfo,
  relevamientoInfo,
  handleGenerateDocument, 
  processing,
  generationResults 
}) => {
  const [hasClientDocuments, setHasClientDocuments] = useState(false);
  const [hasRelevamiento, setHasRelevamiento] = useState(false);
  const [validationStatus, setValidationStatus] = useState('loading');
  const [configuracion, setConfiguracion] = useState({
    incluirPresupuesto: true,
    incluirCronograma: true,
    incluirRiesgos: true,
    enfoqueEjecutivo: 'completo',
    nivelTecnico: 'medio'
  });

  // Validate preconditions
  const validatePreconditions = async () => {
    if (!projectId) {
      setValidationStatus('no-project');
      return;
    }

    try {
      const documents = await projectService.getProjectDocuments(projectId);
      const clientDocs = documents.filter(doc => doc.documentType === 'CLIENTE');
      const relevamientoDocs = documents.filter(doc => doc.documentType === 'RELEVAMIENTO');

      setHasClientDocuments(clientDocs.length > 0);
      setHasRelevamiento(relevamientoDocs.length > 0);

      if (clientDocs.length > 0 && relevamientoDocs.length > 0) {
        setValidationStatus('ready');
      } else {
        setValidationStatus('missing-prerequisites');
      }
    } catch (error) {
      console.error('Error validating preconditions:', error);
      setValidationStatus('error');
    }
  };

  useEffect(() => {
    validatePreconditions();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const canGenerate = () => {
    return validationStatus === 'ready' && hasClientDocuments && hasRelevamiento && !processing;
  };

  const handleGenerate = () => {
    if (canGenerate()) {
      handleGenerateDocument('informe-ejecutivo', {
        clientInfo,
        relevamientoInfo,
        configuracion
      });
    }
  };

  const renderValidationStatus = () => {
    switch (validationStatus) {
      case 'loading':
        return (
          <div className="validation-message validation-loading">
            <div className="loading-spinner"></div>
            <span>Validando precondiciones...</span>
          </div>
        );
      
      case 'no-project':
        return (
          <div className="validation-message validation-error">
            <XIcon className="status-icon" />
            <span>No hay proyecto seleccionado</span>
          </div>
        );
      
      case 'missing-prerequisites':
        return (
          <div className="validation-message validation-warning">
            <AlertTriangleIcon className="status-icon" />
            <div className="prerequisites-list">
              <p><strong>Faltan documentos requeridos:</strong></p>
              <ul>
                {!hasClientDocuments && <li>• Información del cliente (CLIENTE)</li>}
                {!hasRelevamiento && <li>• Plan de relevamiento (RELEVAMIENTO)</li>}
              </ul>
              <p><small>El informe ejecutivo requiere que el relevamiento esté completado.</small></p>
            </div>
          </div>
        );
      
      case 'ready':
        return (
          <div className="validation-message validation-success">
            <CheckIcon className="status-icon" />
            <span>Listo para generar informe ejecutivo</span>
          </div>
        );
      
      case 'error':
        return (
          <div className="validation-message validation-error">
            <XIcon className="status-icon" />
            <span>Error al validar precondiciones</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  const informeResult = generationResults?.find(result => 
    result.documentType === 'informe-ejecutivo' || result.documentType === 'INFORME'
  );

  return (
    <div className="section-container">
      <div className="section-header">
        <h3>� Informe Ejecutivo</h3>
        <p className="section-description">
          Informe ejecutivo profesional basado en el relevamiento realizado
        </p>
      </div>
      
      <div className="informe-content">
        {/* Validation Status */}
        {renderValidationStatus()}

        {/* Configuration Form */}
        {validationStatus === 'ready' && (
          <div className="configuration-form">
            <h4>⚙️ Configuración del Informe</h4>
            
            <div className="config-group">
              <label className="config-label">Enfoque del Informe:</label>
              <select 
                value={configuracion.enfoqueEjecutivo}
                onChange={(e) => setConfiguracion({...configuracion, enfoqueEjecutivo: e.target.value})}
                className="config-select"
              >
                <option value="completo">Completo (todas las secciones)</option>
                <option value="estrategico">Estratégico (enfoque directivo)</option>
                <option value="tecnico">Técnico (enfoque implementación)</option>
                <option value="financiero">Financiero (enfoque costos/ROI)</option>
              </select>
            </div>

            <div className="config-group">
              <label className="config-label">Nivel Técnico:</label>
              <select 
                value={configuracion.nivelTecnico}
                onChange={(e) => setConfiguracion({...configuracion, nivelTecnico: e.target.value})}
                className="config-select"
              >
                <option value="alto">Alto (detalles técnicos)</option>
                <option value="medio">Medio (equilibrado)</option>
                <option value="bajo">Bajo (enfoque ejecutivo)</option>
              </select>
            </div>

            <div className="config-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracion.incluirPresupuesto}
                  onChange={(e) => setConfiguracion({...configuracion, incluirPresupuesto: e.target.checked})}
                />
                <span>Incluir estimación de presupuesto</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracion.incluirCronograma}
                  onChange={(e) => setConfiguracion({...configuracion, incluirCronograma: e.target.checked})}
                />
                <span>Incluir cronograma estimado</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={configuracion.incluirRiesgos}
                  onChange={(e) => setConfiguracion({...configuracion, incluirRiesgos: e.target.checked})}
                />
                <span>Incluir análisis de riesgos</span>
              </label>
            </div>
          </div>
        )}
        
        {/* Content Preview */}
        <div className="informe-preview">
          <h4>📋 Contenido del Informe Ejecutivo</h4>
          <div className="preview-sections">
            <div className="preview-section">
              <strong>1. Resumen Ejecutivo</strong>
              <p>Síntesis de la situación, propuesta y recomendaciones</p>
            </div>
            <div className="preview-section">
              <strong>2. Situación Actual</strong>
              <p>Análisis del estado actual del cliente y necesidades</p>
            </div>
            <div className="preview-section">
              <strong>3. Objetivos del Proyecto</strong>
              <p>Metas y alcance definidos para la solución</p>
            </div>
            <div className="preview-section">
              <strong>4. Propuesta de Solución</strong>
              <p>Recomendaciones técnicas y estratégicas</p>
            </div>
            {configuracion.incluirCronograma && (
              <div className="preview-section">
                <strong>5. Cronograma Estimado</strong>
                <p>Fases del proyecto y tiempos estimados</p>
              </div>
            )}
            {configuracion.incluirPresupuesto && (
              <div className="preview-section">
                <strong>6. Estimación de Presupuesto</strong>
                <p>Costos estimados por categoría</p>
              </div>
            )}
            {configuracion.incluirRiesgos && (
              <div className="preview-section">
                <strong>7. Análisis de Riesgos</strong>
                <p>Identificación y mitigación de riesgos</p>
              </div>
            )}
            <div className="preview-section">
              <strong>8. Recomendaciones</strong>
              <p>Próximos pasos y consideraciones clave</p>
            </div>
            <div className="preview-section">
              <strong>9. Conclusiones</strong>
              <p>Resumen final y decisiones recomendadas</p>
            </div>
          </div>
        </div>

        {/* Results Display */}
        {informeResult && (
          <div className="results-display">
            <h4>✅ Informe Ejecutivo Generado</h4>
            <div className="result-info">
              <p><strong>Archivo:</strong> {informeResult.fileName || 'informe_ejecutivo.md'}</p>
              <p><strong>Palabras:</strong> {informeResult.wordCount || 'N/A'}</p>
              <p><strong>Generado:</strong> {informeResult.generatedAt ? new Date(informeResult.generatedAt).toLocaleString('es-ES') : 'Ahora'}</p>
            </div>
            {informeResult.content && (
              <div className="content-preview">
                <h5>Vista previa:</h5>
                <div className="content-snippet">
                  {informeResult.content.substring(0, 200)}...
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Generate Button */}
        <div className="generate-section">
          <button 
            className={`generate-button ${!canGenerate() ? 'disabled' : ''}`}
            onClick={handleGenerate}
            disabled={!canGenerate()}
          >
            {processing ? (
              <span>Generando informe ejecutivo...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Informe Ejecutivo
              </>
            )}
          </button>
          
          {!canGenerate() && validationStatus !== 'loading' && (
            <p className="button-help">
              {validationStatus === 'missing-prerequisites' 
                ? 'Complete el relevamiento antes de generar el informe ejecutivo'
                : 'Valide los requisitos para continuar'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformeSection;