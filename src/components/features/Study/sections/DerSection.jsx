import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const DerSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>🗄️ Diagrama Entidad-Relación (DER)</h3>
        <p className="section-description">Modelo de datos del sistema</p>
      </div>
      
      <div className="der-content">
        <div className="der-elements">
          <div className="element-info">
            <h5>Elementos del DER</h5>
            <ul>
              <li><strong>Entidades:</strong> Objetos del sistema</li>
              <li><strong>Relaciones:</strong> Vínculos entre entidades</li>
              <li><strong>Atributos:</strong> Propiedades de las entidades</li>
              <li><strong>Cardinalidad:</strong> Tipo de relaciones (1:1, 1:N, N:M)</li>
            </ul>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('der')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Diagrama DER
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DerSection;