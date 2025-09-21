import React, { useState } from 'react';

const StudyPanel = ({ selectedFiles }) => {
  const [activeTab, setActiveTab] = useState('notes');

  // En una implementación real, estas notas vendrían de la API o de un estado global
  const [notes, setNotes] = useState([
    { id: 1, title: 'Nota sobre el relevamiento', content: 'Puntos clave del relevamiento inicial...' },
    { id: 2, title: 'Ideas para implementación', content: 'Lista de tecnologías a considerar...' }
  ]);

  // Función para añadir una nueva nota
  const addNote = () => {
    const newNote = {
      id: notes.length + 1,
      title: `Nueva nota ${notes.length + 1}`,
      content: 'Escribe aquí el contenido de tu nota...'
    };
    setNotes([...notes, newNote]);
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
            {selectedFiles.length > 0 ? (
              <div className="summary-content">
                <p>
                  Resumen generado basado en los {selectedFiles.length} archivos seleccionados.
                  En una implementación real, este contenido sería generado por la IA analizando
                  los documentos seleccionados.
                </p>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file}: Puntos clave extraídos del documento...</li>
                  ))}
                </ul>
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
            {selectedFiles.length > 0 ? (
              <div className="details-content">
                <p>
                  Análisis detallado de los documentos seleccionados.
                  Esta sección mostraría información técnica específica extraída por la IA.
                </p>
                <div className="file-details">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-detail-item">
                      <h4>{file}</h4>
                      <p>Estadísticas del documento:</p>
                      <ul>
                        <li>Páginas: {Math.floor(Math.random() * 20) + 1}</li>
                        <li>Secciones principales: {Math.floor(Math.random() * 5) + 1}</li>
                        <li>Fecha de última modificación: {new Date().toLocaleDateString()}</li>
                      </ul>
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