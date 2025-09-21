import { useState, useEffect } from 'react';
import { getDocumentTypes } from '../services/api';

const DocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setLoading(true);
        const response = await getDocumentTypes();
        
        if (response.success && response.documentTypes) {
          setDocumentTypes(response.documentTypes);
        }
      } catch (err) {
        console.error('Error al obtener tipos de documentos:', err);
        setError('No se pudieron cargar los tipos de documentos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando tipos de documentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Tipos de Documentos</h1>
      
      <div className="section-description">
        <p>
          La API soporta diferentes tipos de documentos para procesamiento con IA.
          Cada tipo está optimizado para un caso de uso específico.
        </p>
      </div>
      
      {documentTypes.length === 0 ? (
        <div className="empty-state">
          <p>No hay tipos de documentos disponibles.</p>
        </div>
      ) : (
        <div className="document-types">
          {documentTypes.map((docType) => (
            <div key={docType.type} className="document-type-card">
              <h3 className="document-type-title">{docType.name}</h3>
              <p className="document-type-description">{docType.description}</p>
              
              <div className="document-type-details">
                <div className="formats">
                  <p className="detail-label">Formatos disponibles:</p>
                  <div className="formats-list">
                    {docType.outputFormats.map((format) => (
                      <span key={format} className="format-tag">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="type-id">
                  <p className="detail-label">ID para API:</p>
                  <code>{docType.type}</code>
                </div>
              </div>
              
              <a href="/upload" className="use-document-type-btn">
                Usar este tipo de documento
              </a>
            </div>
          ))}
        </div>
      )}
      
      <div className="section-note">
        <h3>¿Cómo elegir el tipo de documento adecuado?</h3>
        <ul>
          <li>
            <strong>Relevamiento Técnico:</strong> Ideal para análisis detallados de sistemas, documentación técnica y especificaciones.
          </li>
          <li>
            <strong>Informe Ejecutivo:</strong> Perfecto para crear resúmenes concisos y presentaciones para la gerencia.
          </li>
          <li>
            <strong>Procesamiento General:</strong> Para casos de uso generales donde los otros tipos no aplican específicamente.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentTypes;