import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const ObjetivosSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>🎯 Objetivos del Sistema</h3>
        <p className="section-description">Definición de objetivos basados en requerimientos del cliente</p>
      </div>
      
      <div className="objetivos-content">
        <div className="objectives-framework">
          <h4>Tipos de Objetivos</h4>
          <div className="objectives-grid">
            <div className="objective-type">
              <h5>🎯 Objetivos Generales</h5>
              <p>Propósito principal del sistema</p>
            </div>
            <div className="objective-type">
              <h5>📌 Objetivos Específicos</h5>
              <p>Metas detalladas y medibles</p>
            </div>
            <div className="objective-type">
              <h5>🔍 Límites del Sistema</h5>
              <p>Alcance y restricciones</p>
            </div>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('objetivos')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Objetivos
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObjetivosSection;