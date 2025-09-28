import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const CasosUsoSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>⚙️ Casos de Uso</h3>
        <p className="section-description">Casos de uso y actores del sistema</p>
      </div>
      
      <div className="use-cases-content">
        <div className="use-case-elements">
          <h4>Componentes de Casos de Uso</h4>
          <div className="components-grid">
            <div className="component-card">
              <h5>👥 Actores</h5>
              <p>Usuarios del sistema</p>
            </div>
            <div className="component-card">
              <h5>🔄 Casos de Uso</h5>
              <p>Funcionalidades del sistema</p>
            </div>
            <div className="component-card">
              <h5>🔗 Relaciones</h5>
              <p>Asociaciones y dependencias</p>
            </div>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('casos-uso')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Casos de Uso
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CasosUsoSection;