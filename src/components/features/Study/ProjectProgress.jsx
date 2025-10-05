import React from 'react';
import { CheckIcon, XIcon, ClockIcon, AlertTriangleIcon } from '../../ui/Icons';
import { useStudy } from '../../../contexts';

const ProjectProgress = ({ activeTab, setActiveTab }) => {
  const { 
    documentStates, 
    canGenerate, 
    getMissingRequirements,
    DOCUMENT_STATES 
  } = useStudy();

  // Configuración de las etapas y secciones
  const projectStages = {
    PRELIMINAR: {
      name: '🔍 Preliminar',
      sections: [
        { id: 'CLIENTE', name: 'Cliente', icon: '👤', description: 'Información del cliente' },
        { id: 'RELEVAMIENTO', name: 'Relevamiento', icon: '📋', description: 'Plan de relevamiento' },
        { id: 'INFORME', name: 'Informe', icon: '📊', description: 'Informe ejecutivo' }
      ]
    },
    ANALISIS: {
      name: '🎯 Análisis',
      sections: [
        { id: 'OBJETIVOS', name: 'Objetivos', icon: '🎯', description: 'Objetivos del proyecto' },
        { id: 'HISTORIAS_USUARIO', name: 'Historias', icon: '👥', description: 'Historias de usuario' },
        { id: 'CASOS_USO', name: 'Casos de Uso', icon: '🔄', description: 'Casos de uso' }
      ]
    },
    DISENO: {
      name: '🎨 Diseño',
      sections: [
        { id: 'DIAGRAMAS_FLUJO', name: 'Diagramas', icon: '📊', description: 'Diagramas de flujo' },
        { id: 'DER', name: 'DER', icon: '🗃️', description: 'Diagrama entidad-relación' },
        { id: 'SPRINTS', name: 'Sprints', icon: '🏃', description: 'Planificación de sprints' }
      ]
    }
  };

  // Función para obtener el estado visual de una sección
  const getSectionStatus = (sectionId) => {
    const docState = documentStates[sectionId];
    const canGen = canGenerate(sectionId);
    const missing = getMissingRequirements(sectionId);

    switch (docState) {
      case DOCUMENT_STATES.COMPLETED:
        return {
          status: 'completed',
          icon: <CheckIcon className="status-icon completed" />,
          color: 'var(--success-color)',
          message: 'Completado',
          disabled: false
        };
      
      case DOCUMENT_STATES.IN_PROGRESS:
        return {
          status: 'in-progress',
          icon: <ClockIcon className="status-icon in-progress" />,
          color: 'var(--warning-color)',
          message: 'En progreso...',
          disabled: true
        };
      
      case DOCUMENT_STATES.ERROR:
        return {
          status: 'error',
          icon: <XIcon className="status-icon error" />,
          color: 'var(--error-color)',
          message: 'Error',
          disabled: false
        };
      
      default:
        if (canGen) {
          return {
            status: 'ready',
            icon: <div className="status-dot ready"></div>,
            color: 'var(--primary-color)',
            message: 'Listo para generar',
            disabled: false
          };
        } else if (missing.length > 0) {
          return {
            status: 'blocked',
            icon: <AlertTriangleIcon className="status-icon blocked" />,
            color: 'var(--muted-color)',
            message: `Requiere: ${missing.join(', ')}`,
            disabled: true
          };
        } else {
          return {
            status: 'available',
            icon: <div className="status-dot available"></div>,
            color: 'var(--muted-color)',
            message: 'Disponible',
            disabled: false
          };
        }
    }
  };

  // Función para manejar el clic en una sección
  const handleSectionClick = (sectionId, status) => {
    if (!status.disabled) {
      setActiveTab(sectionId);
    }
  };

  // Calcular progreso general
  const totalSections = Object.values(projectStages).reduce((acc, stage) => acc + stage.sections.length, 0);
  const completedSections = Object.values(documentStates).filter(state => state === DOCUMENT_STATES.COMPLETED).length;
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <div className="project-progress">
      {/* Barra de progreso general */}
      <div className="overall-progress">
        <div className="progress-header">
          <h3>Progreso del Proyecto</h3>
          <span className="progress-percentage">{progressPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{completedSections} de {totalSections} secciones completadas</span>
        </div>
      </div>

      {/* Navigation por etapas */}
      <div className="stages-navigation">
        {Object.entries(projectStages).map(([stageKey, stage]) => (
          <div key={stageKey} className="stage-group">
            <div className="stage-header">
              <h4 className="stage-title">{stage.name}</h4>
              <div className="stage-progress">
                {stage.sections.filter(s => documentStates[s.id] === DOCUMENT_STATES.COMPLETED).length}/{stage.sections.length}
              </div>
            </div>
            
            <div className="stage-sections">
              {stage.sections.map(section => {
                const status = getSectionStatus(section.id);
                const isActive = activeTab === section.id;
                
                return (
                  <button
                    key={section.id}
                    className={`section-button ${status.status} ${isActive ? 'active' : ''} ${status.disabled ? 'disabled' : ''}`}
                    onClick={() => handleSectionClick(section.id, status)}
                    disabled={status.disabled}
                    title={`${section.description} - ${status.message}`}
                  >
                    <div className="section-icon">
                      <span className="section-emoji">{section.icon}</span>
                      <div className="section-status">
                        {status.icon}
                      </div>
                    </div>
                    
                    <div className="section-info">
                      <span className="section-name">{section.name}</span>
                      <span className="section-status-text">{status.message}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectProgress;