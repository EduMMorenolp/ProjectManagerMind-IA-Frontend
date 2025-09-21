import React, { useState, useEffect } from 'react';
import { AddIcon, SearchIcon, CheckIcon, PdfIcon, DocIcon, UploadIcon } from './icons/index.jsx';
import { getProjects, uploadDocuments } from '../services/api';
import './upload-modal.css';

const SourcesPanel = ({ selectedFiles, setSelectedFiles }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Cargar los archivos disponibles desde la API
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      // Obtener proyectos y documentos disponibles desde la API
      const projectsData = await getProjects();
      
      // Transformar los datos para adaptarse a la estructura esperada
      const filesData = [];
      
      if (projectsData && projectsData.projects) {
        projectsData.projects.forEach(project => {
          if (project.documents) {
            project.documents.forEach(doc => {
              filesData.push({
                name: doc.name || doc.id,
                type: doc.type || 'pdf',
                id: doc.id,
                projectName: project.name
              });
            });
          }
        });
      }
      
      setFiles(filesData);
      
      // Si no hay documentos, mostrar mensaje vacío
      if (filesData.length === 0) {
        console.log('No se encontraron documentos en la API');
      }
    } catch (err) {
      console.error('Error al cargar archivos:', err);
      setError('No se pudieron cargar los archivos.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (fileName) => {
    if (selectedFiles.includes(fileName)) {
      setSelectedFiles(selectedFiles.filter(file => file !== fileName));
    } else {
      setSelectedFiles([...selectedFiles, fileName]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.name));
    }
  };

  const handleAddClick = () => {
    setShowUploadModal(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('documents', selectedFile);
      
      // Subir el archivo al servidor
      await uploadDocuments(formData);
      
      // Recargar la lista de archivos
      await loadFiles();
      
      // Cerrar el modal
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error al subir archivo:', err);
      setError('No se pudo subir el archivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sources-panel-container">
      <div className="sources-header">
        <h2>Fuentes</h2>
        <div className="sources-actions">
          <button className="icon-button" onClick={handleAddClick} title="Subir documento">
            <AddIcon className="icon" />
          </button>
          <button className="icon-button" title="Buscar documentos">
            <SearchIcon className="icon" />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="select-all-container">
        <div className="select-all-checkbox">
          <button 
            className={`checkbox-button ${selectedFiles.length === files.length ? 'selected' : ''}`}
            onClick={handleSelectAll}
          >
            {selectedFiles.length === files.length && <CheckIcon className="check-icon" />}
          </button>
          <span>Seleccionar todas las fuentes</span>
        </div>
      </div>

      <div className="files-list">
        {loading ? (
          <div className="loading-message">Cargando archivos...</div>
        ) : files.length === 0 ? (
          <div className="empty-state">
            <p>No hay archivos disponibles.</p>
            <button className="add-file-button" onClick={handleAddClick}>
              <UploadIcon className="upload-icon" />
              Subir documento
            </button>
          </div>
        ) : (
          files.map((file, index) => (
            <div 
              key={index} 
              className={`file-item ${selectedFiles.includes(file.name) ? 'selected' : ''}`}
              onClick={() => handleFileSelect(file.name)}
            >
              <div className="file-checkbox">
                <button className={`checkbox-button ${selectedFiles.includes(file.name) ? 'selected' : ''}`}>
                  {selectedFiles.includes(file.name) && <CheckIcon className="check-icon" />}
                </button>
              </div>
              <div className="file-icon">
                {file.type === 'pdf' ? <PdfIcon className="file-type-icon" /> : <DocIcon className="file-type-icon" />}
              </div>
              <div className="file-name">
                {file.name}
              </div>
            </div>
          ))
        )}
      </div>

      {showUploadModal && (
        <div className="upload-modal">
          <div className="upload-modal-content">
            <h3>Subir documento</h3>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={handleFileUpload} 
            />
            <div className="upload-modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
              >
                Cancelar
              </button>
              <button 
                className="upload-button" 
                onClick={handleUpload}
                disabled={!selectedFile || loading}
              >
                {loading ? 'Subiendo...' : 'Subir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcesPanel;