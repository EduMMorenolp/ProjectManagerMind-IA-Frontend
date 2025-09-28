import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const SprintsSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>⚡ Planificación de Sprints</h3>
        <p className="section-description">Sprint backlog basado en historias de usuario</p>
      </div>
      
      <div className="sprints-content">
        <div className="sprint-planning">
          <h4>Elementos del Sprint</h4>
          <div className="sprint-elements">
            <div className="element-card">
              <h5>📋 Product Backlog</h5>
              <p>Lista priorizada de funcionalidades</p>
            </div>
            <div className="element-card">
              <h5>⏱️ Sprint Backlog</h5>
              <p>Tareas específicas del sprint</p>
            </div>
            <div className="element-card">
              <h5>🏃 Velocidad del Equipo</h5>
              <p>Capacidad de trabajo estimada</p>
            </div>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('sprints')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Planning de Sprints
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintsSection;