import React, { useState, useMemo } from 'react';
import { PlayIcon } from '../../../ui/Icons';
import DERViewer from '../../DERViewer';

const DerSection = ({ 
  processing, 
  selectedFiles = [], 
  selectedProject 
}) => {
  // Estados locales
  const [showDERViewer, setShowDERViewer] = useState(false);
  const [derError, setDerError] = useState(null);

  // Procesar archivos seleccionados para extraer textos
  const extractedTexts = useMemo(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return [];
    }

    return selectedFiles.map(file => ({
      filename: file.name || file.filename || 'archivo',
      content: file.extractedText || file.content || '',
      type: file.type || 'documento',
      size: file.size || 0
    })).filter(file => file.content.trim().length > 0);
  }, [selectedFiles]);

  const handleGenerateDER = () => {
    if (extractedTexts.length === 0) {
      setDerError('No hay archivos con contenido extraído para analizar');
      return;
    }

    setDerError(null);
    setShowDERViewer(true);
  };

  const handleDERGenerated = (derData) => {
    console.log('DER generado en StudyPanel:', derData);
    // Aquí se podría guardar el resultado en el contexto o estado global
  };

  const handleDERError = (error) => {
    console.error('Error en DER:', error);
    setDerError(error);
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h3>🗄️ Diagrama Entidad-Relación (DER)</h3>
        <p className="section-description">
          Modelo de datos del sistema generado automáticamente desde los documentos
        </p>
      </div>
      
      {/* Información sobre archivos */}
      <div className="files-info">
        <h5>Archivos disponibles para análisis:</h5>
        {selectedFiles && selectedFiles.length > 0 ? (
          <ul className="files-list">
            {selectedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <span className="file-name">{file.name || `Archivo ${index + 1}`}</span>
                <span className="file-status">
                  {file.extractedText ? '✅ Texto extraído' : '⚠️ Sin contenido'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-files">No hay archivos seleccionados</p>
        )}
      </div>

      {/* Mostrar errores */}
      {derError && (
        <div className="alert alert-error">
          <strong>Error:</strong> {derError}
        </div>
      )}

      {/* Controles de generación */}
      <div className="der-controls">
        {!showDERViewer ? (
          <div className="der-content">
            <div className="der-elements">
              <div className="element-info">
                <h5>Elementos del DER a generar:</h5>
                <ul>
                  <li><strong>Entidades:</strong> Objetos identificados en los documentos</li>
                  <li><strong>Relaciones:</strong> Vínculos y dependencias entre entidades</li>
                  <li><strong>Atributos:</strong> Propiedades y campos de cada entidad</li>
                  <li><strong>Cardinalidad:</strong> Tipo de relaciones (1:1, 1:N, N:M)</li>
                  <li><strong>Scripts SQL:</strong> Código para crear la base de datos</li>
                  <li><strong>Índices y Constraints:</strong> Optimizaciones y validaciones</li>
                </ul>
              </div>
            </div>
            
            <div className="generate-section">
              <button 
                className="generate-button" 
                onClick={handleGenerateDER}
                disabled={processing || extractedTexts.length === 0}
              >
                <PlayIcon />
                {processing ? 'Generando...' : 'Generar DER'}
              </button>
              
              <p className="generate-info">
                {extractedTexts.length > 0 
                  ? `${extractedTexts.length} archivo(s) listo(s) para análisis`
                  : 'Selecciona archivos con contenido extraído'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="der-viewer-container">
            <div className="viewer-header">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDERViewer(false)}
              >
                ← Volver a configuración
              </button>
            </div>
            
            <DERViewer
              projectId={selectedProject?.id}
              projectName={selectedProject?.name || 'Proyecto sin nombre'}
              extractedTexts={extractedTexts}
              onDERGenerated={handleDERGenerated}
              onError={handleDERError}
              initialConfig={{
                motor: 'postgresql',
                incluirIndices: true,
                incluirConstraints: true,
                incluirVistas: true,
                notacion: 'crow_foot'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DerSection;