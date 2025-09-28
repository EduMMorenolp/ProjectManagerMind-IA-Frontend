import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const InformeSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>📄 Informe Ejecutivo</h3>
        <p className="section-description">Resumen ejecutivo basado en el relevamiento</p>
      </div>
      
      <div className="informe-content">
        <div className="informe-preview">
          <h4>Contenido del Informe</h4>
          <ul>
            <li>Resumen ejecutivo</li>
            <li>Situación actual del cliente</li>
            <li>Problemática identificada</li>
            <li>Propuesta de solución</li>
            <li>Recomendaciones</li>
          </ul>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('informe-ejecutivo')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Informe Ejecutivo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformeSection;