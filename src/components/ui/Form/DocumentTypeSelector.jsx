import React, { useState, useEffect } from 'react';
import { useDocumentTypes } from '../../../hooks';

/**
 * Componente para seleccionar etapa del proyecto y tipo de documento
 */
const DocumentTypeSelector = ({ 
  selectedStage, 
  selectedType, 
  onStageChange, 
  onTypeChange,
  disabled = false,
  showDescription = true 
}) => {
  const { stages, loading, error, getTypesForStage, getStageInfo, getTypeInfo } = useDocumentTypes();
  const [availableTypes, setAvailableTypes] = useState([]);

  // Actualizar tipos disponibles cuando cambia la etapa
  useEffect(() => {
    if (selectedStage) {
      const types = getTypesForStage(selectedStage);
      setAvailableTypes(types);
      
      // Si no hay tipo seleccionado o el tipo actual no pertenece a la etapa, seleccionar el primero
      if (!selectedType || !types.find(t => t.key === selectedType)) {
        if (types.length > 0) {
          onTypeChange(types[0].key);
        }
      }
    } else {
      setAvailableTypes([]);
      onTypeChange('');
    }
  }, [selectedStage, selectedType, getTypesForStage, onTypeChange]);

  if (loading) {
    return (
      <div className="document-type-selector loading">
        <div className="loading-spinner">⏳</div>
        <p>Cargando tipos de documentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="document-type-selector error">
        <div className="error-icon">⚠️</div>
        <p>Error al cargar tipos de documentos: {error}</p>
      </div>
    );
  }

  const selectedStageInfo = getStageInfo(selectedStage);
  const selectedTypeInfo = selectedStage && selectedType ? getTypeInfo(selectedStage, selectedType) : null;

  return (
    <div className="document-type-selector">
      {/* Selector de Etapa */}
      <div className="form-group">
        <label htmlFor="stage-select" className="form-label">
          <span className="label-text">Etapa del Proyecto</span>
          <span className="label-required">*</span>
        </label>
        <select
          id="stage-select"
          className="form-select"
          value={selectedStage || ''}
          onChange={(e) => onStageChange(e.target.value)}
          disabled={disabled}
          required
        >
          <option value="">Seleccione una etapa...</option>
          {stages.map(stage => (
            <option key={stage.key} value={stage.key}>
              {stage.name}
            </option>
          ))}
        </select>
        
        {/* Descripción de la etapa seleccionada */}
        {showDescription && selectedStageInfo && (
          <div className="field-description">
            <span className="description-icon">ℹ️</span>
            {selectedStageInfo.description}
          </div>
        )}
      </div>

      {/* Selector de Tipo de Documento */}
      {selectedStage && (
        <div className="form-group">
          <label htmlFor="type-select" className="form-label">
            <span className="label-text">Tipo de Documento</span>
            <span className="label-required">*</span>
          </label>
          <select
            id="type-select"
            className="form-select"
            value={selectedType || ''}
            onChange={(e) => onTypeChange(e.target.value)}
            disabled={disabled || availableTypes.length === 0}
            required
          >
            <option value="">Seleccione un tipo...</option>
            {availableTypes.map(type => (
              <option key={type.key} value={type.key}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>

          {/* Descripción del tipo seleccionado */}
          {showDescription && selectedTypeInfo && (
            <div className="field-description">
              <span className="description-icon">{selectedTypeInfo.icon}</span>
              {selectedTypeInfo.description}
            </div>
          )}

          {/* Mensaje si no hay tipos disponibles */}
          {selectedStage && availableTypes.length === 0 && (
            <div className="field-warning">
              <span className="warning-icon">⚠️</span>
              No hay tipos de documentos disponibles para esta etapa.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentTypeSelector;