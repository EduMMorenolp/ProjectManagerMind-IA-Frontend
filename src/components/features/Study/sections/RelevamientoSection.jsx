import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const RelevamientoSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>📋 Relevamiento de Información</h3>
        <p className="section-description">Métodos de recopilación: Entrevistas, Cuestionarios, Observación</p>
      </div>
      
      <div className="relevamiento-content">
        <div className="method-selector">
          <h4>Métodos de Relevamiento</h4>
          <div className="methods-grid">
            <div className="method-card">
              <h5>📞 Entrevistas</h5>
              <p>Conversaciones directas con stakeholders</p>
            </div>
            <div className="method-card">
              <h5>📊 Cuestionarios</h5>
              <p>Formularios estructurados para recopilación</p>
            </div>
            <div className="method-card">
              <h5>👀 Observación</h5>
              <p>Análisis de procesos existentes</p>
            </div>
            <div className="method-card">
              <h5>📂 Documentos</h5>
              <p>Revisión de archivos y documentación</p>
            </div>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('relevamiento')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Relevamiento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelevamientoSection;