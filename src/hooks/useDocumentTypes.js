import { useState, useEffect } from 'react';
import { getDocumentTypes } from '../services';

/**
 * Hook para obtener y gestionar los tipos de documentos
 */
export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState({});
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true);
        const response = await getDocumentTypes();
        
        if (response.success) {
          // Organizar los tipos por etapa
          const typesByStage = {};
          const stagesList = [];
          
          // Primero, crear las etapas
          Object.values(response.projectStages || {}).forEach(stage => {
            if (!stagesList.find(s => s.key === stage.key)) {
              stagesList.push(stage);
            }
            typesByStage[stage.key] = [];
          });
          
          // Luego, asignar los tipos a sus etapas
          Object.values(response.documentTypes || {}).forEach(type => {
            if (typesByStage[type.stage]) {
              typesByStage[type.stage].push(type);
            }
          });
          
          // Ordenar etapas por orden
          stagesList.sort((a, b) => a.order - b.order);
          
          // Ordenar tipos dentro de cada etapa
          Object.keys(typesByStage).forEach(stageKey => {
            typesByStage[stageKey].sort((a, b) => a.order - b.order);
          });
          
          setStages(stagesList);
          setDocumentTypes(typesByStage);
        }
      } catch (err) {
        console.error('Error fetching document types:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  /**
   * Obtener tipos de documentos para una etapa específica
   */
  const getTypesForStage = (stageKey) => {
    return documentTypes[stageKey] || [];
  };

  /**
   * Obtener información de una etapa
   */
  const getStageInfo = (stageKey) => {
    return stages.find(stage => stage.key === stageKey);
  };

  /**
   * Obtener información de un tipo de documento
   */
  const getTypeInfo = (stageKey, typeKey) => {
    const stageTypes = getTypesForStage(stageKey);
    return stageTypes.find(type => type.key === typeKey);
  };

  return {
    documentTypes,
    stages,
    loading,
    error,
    getTypesForStage,
    getStageInfo,
    getTypeInfo
  };
};

export default useDocumentTypes;