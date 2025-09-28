import React from 'react';
import { PlayIcon } from '../../../ui/Icons';

const DiagramasFlujoSection = ({ handleGenerateDocument, processing }) => {
  return (
    <div className="section-container">
      <div className="section-header">
        <h3>🔄 Diagramas de Flujo de Datos (DFD)</h3>
        <p className="section-description">Componentes, reglas y niveles de diagramas</p>
      </div>
      
      <div className="dfd-content">
        <div className="dfd-levels">
          <div className="level-card">
            <h5>📊 Diagrama de Contexto</h5>
            <p>Vista general del sistema</p>
          </div>
          <div className="level-card">
            <h5>📈 Diagrama Nivel 1</h5>
            <p>Procesos principales</p>
          </div>
          <div className="level-card">
            <h5>📉 Diagrama Nivel 2</h5>
            <p>Detalle de subprocesos</p>
          </div>
        </div>
        
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={() => handleGenerateDocument('diagramas-flujo')}
            disabled={processing}
          >
            {processing ? (
              <span>Generando...</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Diagramas DFD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramasFlujoSection;