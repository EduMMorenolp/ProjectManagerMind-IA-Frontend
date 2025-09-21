import React, { useState, useEffect } from 'react';
import { AddIcon, SearchIcon, CheckIcon, PdfIcon, DocIcon, UploadIcon } from './icons/index.jsx';
import { getProjects, uploadDocuments, createProject } from '../services/api';
import ProjectModal from './ProjectModal';
import './upload-modal.css';

const SourcesPanel = ({ selectedFiles, setSelectedFiles, selectedProject, setSelectedProject }) => {
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectFiles(selectedProject.id);
    } else {
      setFiles([]);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectsData = await getProjects();
      let projectsList = [];
      
      if (projectsData?.projects && Array.isArray(projectsData.projects)) {
        projectsList = projectsData.projects;
      }
      
      setProjects(projectsList);
      
      if (projectsList.length > 0 && !selectedProject) {
        setSelectedProject(projectsList[0]);
      }
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      setError('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async (projectId) => {
    if (!projectId) return;
    
    const project = projects.find(p => p.id === projectId);
    if (!project?.documents) {
      setFiles([]);
      return;
    }

    const filesData = project.documents.map(doc => ({
      name: doc.fileName || doc.name || 'Documento sin nombre',
      type: doc.fileType || 'pdf',
      id: doc.id,
      projectName: project.name,
      size: doc.characterCount || 0,
      createdAt: doc.createdAt
    }));
    
    setFiles(filesData);
  };

  const handleFileSelect = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
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
    if (!selectedFile || !selectedProject) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('documents', selectedFile);
      formData.append('projectId', selectedProject.id);
      
      await uploadDocuments(formData);
      await loadProjects();
      
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error al subir archivo:', err);
      setError('No se pudo subir el archivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    await createProject(projectData);
    await loadProjects();
  };

  return (
    <div className="sources-panel-container">
      <div className="sources-header">
        <h2>Fuentes</h2>
        <div className="sources-actions">
          <button className="icon-button" onClick={() => setShowProjectModal(true)} title="Nuevo proyecto">
            <AddIcon className="icon" />
          </button>
          <button className="icon-button" onClick={handleAddClick} title="Subir documento" disabled={!selectedProject}>
            <UploadIcon className="icon" />
          </button>
        </div>
      </div>

      {projects.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <select 
            value={selectedProject?.id || ''} 
            onChange={(e) => {
              const project = projects.find(p => p.id === e.target.value);
              setSelectedProject(project);
              setSelectedFiles([]); // Clear selected files when changing project
            }}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)' 
            }}
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project._count?.documents || 0} docs)
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button 
            className="retry-button" 
            onClick={loadFiles}
            style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
          >
            Reintentar
          </button>
        </div>
      )}

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
          <div className="loading-message">
            <div className="loading-spinner"></div>
            Cargando archivos...
          </div>
        ) : files.length === 0 && !error ? (
          <div className="empty-state">
            <p>No hay archivos disponibles.</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Sube algunos documentos para comenzar a trabajar.</p>
            <button className="add-file-button" onClick={handleAddClick}>
              <UploadIcon className="upload-icon" />
              Subir documento
            </button>
          </div>
        ) : files.length > 0 ? (
          files.map((file, index) => (
            <div 
              key={index} 
              className={`file-item ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
              onClick={() => handleFileSelect(file.id)}
            >
              <div className="file-checkbox">
                <button className={`checkbox-button ${selectedFiles.includes(file.id) ? 'selected' : ''}`}>
                  {selectedFiles.includes(file.id) && <CheckIcon className="check-icon" />}
                </button>
              </div>
              <div className="file-icon">
                {file.type === 'pdf' ? <PdfIcon className="file-type-icon" /> : <DocIcon className="file-type-icon" />}
              </div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
              </div>
            </div>
          ))
        ) : selectedProject ? (
          <div className="empty-state">
            <p>No hay documentos en este proyecto.</p>
            <button className="add-file-button" onClick={handleAddClick}>
              <UploadIcon className="upload-icon" />
              Subir documento
            </button>
          </div>
        ) : (
          <div className="empty-state">
            <p>Crea un proyecto para comenzar.</p>
            <button className="add-file-button" onClick={() => setShowProjectModal(true)}>
              <AddIcon className="upload-icon" />
              Crear proyecto
            </button>
          </div>
        )}
      </div>

      <ProjectModal 
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectCreated={handleCreateProject}
      />

      {showUploadModal && (
        <div className="upload-modal">
          <div className="upload-modal-content">
            <h3>Subir documento a: {selectedProject?.name}</h3>
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