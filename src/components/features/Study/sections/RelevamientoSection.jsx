import React, { useState, useEffect } from 'react';
import { PlayIcon } from '../../../ui/Icons';
import { getProjectDocuments } from '../../../../services/projectService';

const RelevamientoSection = ({ 
  relevamientoInfo, 
  setRelevamientoInfo, 
  projectId,
  selectedProject,
  handleGenerateDocument, 
  processing 
}) => {
  const [activeTab, setActiveTab] = useState('entrevistas');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasClientDocuments, setHasClientDocuments] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Validar precondiciones al cargar el componente
  useEffect(() => {
    validatePreconditions();
  }, [selectedProject, projectId]);

  // Función para validar que existan documentos CLIENTE
  const validatePreconditions = async () => {
    if (!selectedProject && !projectId) {
      setValidationMessage('⚠️ Selecciona un proyecto para continuar');
      setHasClientDocuments(false);
      return;
    }

    setIsValidating(true);
    setValidationMessage('🔍 Validando documentos base...');

    try {
      const currentProjectId = projectId || selectedProject?.id;
      const documentsResponse = await getProjectDocuments(currentProjectId);
      
      console.log('📋 RelevamientoSection: Documentos obtenidos:', documentsResponse);
      
      // Ahora documentsResponse es directamente el array de documentos
      const documents = documentsResponse || [];
      const clientDocuments = documents.filter(
        doc => doc.documentType === 'CLIENTE' && doc.stage === 'PRELIMINAR'
      );
      
      console.log('👤 RelevamientoSection: Documentos de cliente encontrados:', clientDocuments);

      if (clientDocuments.length > 0) {
        setHasClientDocuments(true);
        setValidationMessage(`✅ Encontrados ${clientDocuments.length} documento(s) de cliente. Listo para generar relevamiento.`);
      } else {
        setHasClientDocuments(false);
        setValidationMessage('❌ No se encontraron documentos de cliente. Sube documentos tipo CLIENTE en la etapa PRELIMINAR primero.');
      }
    } catch (error) {
      console.error('Error validating preconditions:', error);
      setHasClientDocuments(false);
      setValidationMessage('❌ Error al validar precondiciones. Verifica la conexión.');
    } finally {
      setIsValidating(false);
    }
  };

  const tabs = [
    { id: 'entrevistas', name: 'Entrevistas', icon: '📞' },
    { id: 'cuestionarios', name: 'Cuestionarios', icon: '📊' },
    { id: 'observacion', name: 'Observación', icon: '👀' },
    { id: 'documentacion', name: 'Documentación', icon: '📂' }
  ];

  const handleGenerateRelevamiento = async () => {
    if (!hasClientDocuments) {
      setValidationMessage('❌ No se pueden generar documentos sin archivos de cliente');
      return;
    }

    setIsGenerating(true);
    try {
      await handleGenerateDocument('RELEVAMIENTO');
      setValidationMessage('✅ Relevamiento generado exitosamente');
    } catch (error) {
      console.error('Error generating relevamiento:', error);
      
      // Manejo específico de errores comunes
      let errorMessage = '❌ Error al generar relevamiento: ';
      
      if (error.message && error.message.includes('429')) {
        errorMessage += 'Límite de solicitudes excedido. Espera unos minutos e intenta de nuevo.';
      } else if (error.message && error.message.includes('quota')) {
        errorMessage += 'Cuota de API agotada. Verifica los límites en Google AI Studio.';
      } else if (error.message && error.message.includes('Límite de solicitudes')) {
        errorMessage += error.message;
      } else {
        errorMessage += (error.message || 'Error desconocido');
      }
      
      setValidationMessage(errorMessage);
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
        
        {/* Mensaje de validación */}
        <div className="validation-message">
          <p className={`validation-text ${hasClientDocuments ? 'success' : 'warning'}`}>
            {validationMessage}
          </p>
          {isValidating && <div className="validation-spinner">🔄</div>}
        </div>

        {/* Botón de generar relevamiento */}
        <div className="generate-section">
          <button 
            className="generate-button" 
            onClick={handleGenerateRelevamiento}
            disabled={isGenerating || processing || !hasClientDocuments || isValidating}
          >
            {isGenerating ? (
              <span>🔄 Generando Relevamiento...</span>
            ) : !hasClientDocuments ? (
              <span>❌ Documentos de cliente requeridos</span>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Relevamiento
              </>
            )}
          </button>
          
          {!hasClientDocuments && !isValidating && (
            <p className="help-text">
              💡 <strong>Ayuda:</strong> Ve al panel de Fuentes → selecciona tu proyecto → 
              sube documentos con tipo "Cliente" en etapa "Preliminar"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelevamientoSection;