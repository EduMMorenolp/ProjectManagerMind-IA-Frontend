import React, { useState, useEffect } from 'react';
import { PlayIcon } from '../../../ui/Icons';

const RelevamientoSection = ({ 
  relevamientoInfo, 
  setRelevamientoInfo, 
  projectId,
  handleGenerateDocument, 
  processing 
}) => {
  const [activeTab, setActiveTab] = useState('entrevistas');
  const [isGenerating, setIsGenerating] = useState(false);

  // Debug: Log relevamientoInfo changes
  useEffect(() => {
  }, [relevamientoInfo]);

  const tabs = [
    { id: 'entrevistas', name: 'Entrevistas', icon: '📞' },
    { id: 'cuestionarios', name: 'Cuestionarios', icon: '📊' },
    { id: 'observacion', name: 'Observación', icon: '👀' },
    { id: 'documentacion', name: 'Documentación', icon: '📂' }
  ];

  const handleGenerateRelevamiento = async () => {
    setIsGenerating(true);
    try {
      await handleGenerateDocument('RELEVAMIENTO');
    } catch (error) {
      console.error('Error generating relevamiento:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h3>� Relevamiento de Información</h3>
        <p className="section-description">Métodos de recopilación: Entrevistas, Cuestionarios, Observación</p>
      </div>
      
      <div className="relevamiento-content">
        {/* Pestañas de navegación */}
        <div className="relevamiento-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="tab-content">
          <div className="tab-panel">
            <h4>👥 Stakeholders a Entrevistar</h4>
            <p>Funcionalidad de relevamiento en desarrollo...</p>
          </div>
        </div>
        
        {/* Botón de generar relevamiento */}
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={handleGenerateRelevamiento}
            disabled={isGenerating || processing}
          >
            {isGenerating ? (
              <span>🔄 Generando Relevamiento...</span>
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