import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const HistoriasUsuarioSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>📖 Historias de Usuario</h3>
        <p className="section-description">Metodologías ágiles y plantillas de historias</p>
      </div>
      
      <div className="user-stories-content">
        <div className="agile-info">
          <h4>Metodología Ágil - SCRUM</h4>
          <div className="scrum-elements">
            <span className="scrum-tag">Product Backlog</span>
            <span className="scrum-tag">Sprint Planning</span>
            <span className="scrum-tag">User Stories</span>
            <span className="scrum-tag">Velocity</span>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('historias-usuario')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Historias de Usuario
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriasUsuarioSection;