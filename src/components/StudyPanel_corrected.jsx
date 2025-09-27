import React, { useState, useEffect, useCallback } from 'react';
import { getDocument, downloadDocument } from '../services';
import { FileIcon, PdfIcon, DocIcon, DownloadIcon } from './icons/index.jsx';

const StudyPanel = ({ selectedFiles }) => {
  const [activeTab, setActiveTab] = useState('notes');
  const [documentData, setDocumentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // En una implementación real, estas notas vendrían de la API o de un estado global
  const [notes, setNotes] = useState([
    { id: 1, title: 'Nota sobre el relevamiento', content: 'Puntos clave del relevamiento inicial...' },
    { id: 2, title: 'Ideas para implementación', content: 'Lista de tecnologías a considerar...' }
  ]);

  // Usando useCallback para evitar recrear la función en cada renderizado
  const loadDocumentData = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // En una implementación real, aquí cargaríamos datos específicos para cada documento
      const docsData = {};
      
      for (const fileName of selectedFiles) {
        // Extraer projectName y documentId del nombre de archivo (simulado)
        // En una implementación real, estos vendrían directamente de la estructura de datos
        const projectName = 'default';
        const documentId = fileName.replace(/\s+/g, '_').replace(/\.[^/.]+$/, "");
        
        try {
          const docData = await getDocument(projectName, documentId);
          docsData[fileName] = docData;
        } catch (err) {
          console.error(`Error al cargar datos para ${fileName}:`, err);
          docsData[fileName] = { error: 'No se pudieron cargar los datos' };
        }
      }
      
      setDocumentData(docsData);
    } catch (err) {
      console.error('Error al cargar datos de documentos:', err);
      setError('No se pudieron cargar los datos de los documentos.');
    } finally {
      setLoading(false);
    }
  }, [selectedFiles]); // Dependencia: selectedFiles

  useEffect(() => {
    if (selectedFiles.length > 0 && activeTab !== 'notes') {
      loadDocumentData();
    }
  }, [selectedFiles, activeTab, loadDocumentData]); // Dependencias actualizadas

  // Función para añadir una nueva nota
  const addNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: `Nueva nota ${notes.length + 1}`,
      content: 'Escribe aquí el contenido de tu nota...'
    };
    setNotes([...notes, newNote]);
  };

  // Función para descargar un documento
  const handleDownload = async (fileName) => {
    try {
      // Extraer projectName y documentId del nombre de archivo (simulado)
      const projectName = 'default';
      const documentId = fileName.replace(/\s+/g, '_').replace(/\.[^/.]+$/, "");
      
      await downloadDocument(projectName, documentId, 'pdf');
    } catch (err) {
      console.error(`Error al descargar ${fileName}:`, err);
      setError(`No se pudo descargar ${fileName}.`);
    }
  };

  return (
    <div className="study-panel-container">
      <div className="study-panel-header">
        <h2>Estudio</h2>
        <div className="study-tabs">
          <button 
            className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notas
          </button>
          <button 
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Resumen
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Detalles
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="study-panel-content">
        {activeTab === 'notes' && (
          <div className="notes-container">
            <div className="notes-header">
              <h3>Mis notas</h3>
              <button className="add-note-button" onClick={addNote}>+ Nueva nota</button>
            </div>
            <div className="notes-list">
              {notes.map(note => (
                <div key={note.id} className="note-item">
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="summary-container">
            <h3>Resumen de documentos</h3>
            {loading ? (
              <div className="loading-message">Cargando resumen...</div>
            ) : selectedFiles.length > 0 ? (
              <div className="summary-content">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="file-summary">
                    <div className="file-summary-header">
                      <h4>{file}</h4>
                      <button 
                        className="download-button"
                        onClick={() => handleDownload(file)}
                      >
                        <DownloadIcon className="file-icon" />
                        Descargar
                      </button>
                    </div>
                    <div className="file-summary-content">
                      {documentData[file] ? (
                        <p>{documentData[file].summary || 'No hay resumen disponible para este documento.'}</p>
                      ) : (
                        <p>Cargando datos...</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-files-message">
                Selecciona archivos en el panel de fuentes para generar un resumen.
              </p>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="details-container">
            <h3>Detalles técnicos</h3>
            {loading ? (
              <div className="loading-message">Cargando detalles...</div>
            ) : selectedFiles.length > 0 ? (
              <div className="details-content">
                <div className="file-details">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-detail-item">
                      <h4>{file}</h4>
                      {documentData[file] ? (
                        <>
                          <p>Estadísticas del documento:</p>
                          <ul>
                            <li>Páginas: {documentData[file].pages || Math.floor(Math.random() * 20) + 1}</li>
                            <li>Secciones principales: {documentData[file].sections?.length || Math.floor(Math.random() * 5) + 1}</li>
                            <li>Fecha de última modificación: {documentData[file].lastModified || new Date().toLocaleDateString()}</li>
                          </ul>
                        </>
                      ) : (
                        <p>Cargando detalles...</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="no-files-message">
                Selecciona archivos en el panel de fuentes para ver detalles.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPanel;