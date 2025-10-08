import React, { useEffect, useState } from 'react';
import { ClockIcon, CheckIcon, XIcon, RefreshIcon } from '../../ui/Icons';
import { useStudy } from '../../../contexts';

const GenerationProgress = () => {
  const { 
    generationState, 
    currentlyGenerating, 
    generationProgress, 
    estimatedTime,
    GENERATION_STATES
  } = useStudy();

  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  // Iniciar el cronómetro cuando comience la generación
  useEffect(() => {
    if (generationState === GENERATION_STATES.GENERATING) {
      setStartTime(Date.now());
      setElapsed(0);
    } else {
      setStartTime(null);
      setElapsed(0);
    }
  }, [generationState, GENERATION_STATES.GENERATING]);

  // Actualizar el tiempo transcurrido
  useEffect(() => {
    let interval;
    if (startTime && generationState === GENERATION_STATES.GENERATING) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, generationState, GENERATION_STATES.GENERATING]);

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular tiempo restante estimado
  const getTimeRemaining = () => {
    if (!estimatedTime || !elapsed) return null;
    const estimatedSeconds = estimatedTime * 60; // convertir minutos a segundos
    const remaining = Math.max(0, estimatedSeconds - elapsed);
    return Math.ceil(remaining);
  };

  // Obtener título del documento
  const getDocumentTitle = (docType) => {
    const titles = {
      CLIENTE: 'Información del Cliente',
      RELEVAMIENTO: 'Plan de Relevamiento',
      INFORME: 'Informe Ejecutivo',
      'informe-ejecutivo': 'Informe Ejecutivo',
      OBJETIVOS: 'Objetivos del Proyecto',
      HISTORIAS_USUARIO: 'Historias de Usuario',
      DIAGRAMAS_FLUJO: 'Diagramas de Flujo',
      SPRINTS: 'Planificación de Sprints',
      DER: 'Diagrama Entidad-Relación',
      CASOS_USO: 'Casos de Uso'
    };
    return titles[docType] || docType;
  };

  // No mostrar nada si no hay generación activa
  if (generationState === GENERATION_STATES.IDLE) {
    return null;
  }

  return (
    <div className={`generation-progress ${generationState}`}>
      <div className="progress-container">
        
        {/* Estado de generación */}
        {generationState === GENERATION_STATES.GENERATING && (
          <div className="generation-active">
            <div className="progress-header">
              <div className="progress-icon">
                <RefreshIcon className="spinning" />
              </div>
              <div className="progress-info">
                <h4>Generando {getDocumentTitle(currentlyGenerating)}</h4>
                <p>Procesando con IA, por favor espera...</p>
              </div>
            </div>
            
            {/* Barra de progreso animada */}
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill animated" 
                  style={{ width: `${Math.max(generationProgress, 10)}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {generationProgress > 0 ? `${generationProgress}%` : 'Iniciando...'}
              </div>
            </div>
            
            {/* Información de tiempo */}
            <div className="time-info">
              <div className="time-item">
                <ClockIcon className="time-icon" />
                <span>Transcurrido: {formatTime(elapsed)}</span>
              </div>
              
              {estimatedTime && (
                <div className="time-item">
                  <span>Estimado: {estimatedTime} min</span>
                </div>
              )}
              
              {getTimeRemaining() && getTimeRemaining() > 0 && (
                <div className="time-item">
                  <span>Restante: ~{formatTime(getTimeRemaining())}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado de éxito */}
        {generationState === GENERATION_STATES.SUCCESS && (
          <div className="generation-success">
            <div className="success-header">
              <CheckIcon className="success-icon" />
              <div className="success-info">
                <h4>¡Documento generado exitosamente!</h4>
                <p>{getDocumentTitle(currentlyGenerating)} completado</p>
              </div>
            </div>
            <div className="success-stats">
              <span>Completado en {formatTime(elapsed)}</span>
            </div>
          </div>
        )}

        {/* Estado de error */}
        {generationState === GENERATION_STATES.ERROR && (
          <div className="generation-error">
            <div className="error-header">
              <XIcon className="error-icon" />
              <div className="error-info">
                <h4>Error en la generación</h4>
                <p>No se pudo generar {getDocumentTitle(currentlyGenerating)}</p>
              </div>
            </div>
            <div className="error-actions">
              <button className="retry-button">
                <RefreshIcon className="button-icon" />
                Reintentar
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default GenerationProgress;