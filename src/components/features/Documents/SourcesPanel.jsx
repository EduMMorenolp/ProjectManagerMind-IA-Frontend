import React, { useState, useEffect } from 'react';
import { AddIcon, SearchIcon, CheckIcon, PdfIcon, DocIcon, UploadIcon } from '../../ui/Icons';
import { getProjects, uploadDocuments, createProject, getProjectDocuments } from '../../../services';
import { ProjectModal } from '../../ui/Modal';
import '../../../styles/upload-modal.css';

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
  }, [selectedProject, projects]);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Cargando proyectos...');
      const projectsData = await getProjects();
      console.log('📦 Datos recibidos:', projectsData);
      
      let projectsList = [];
      
      // La nueva API devuelve los proyectos directamente en el array 'projects'
      if (projectsData?.projects && Array.isArray(projectsData.projects)) {
        projectsList = projectsData.projects;
      } else if (Array.isArray(projectsData)) {
        // En caso de que la respuesta sea directamente un array
        projectsList = projectsData;
      }
      
      console.log('📋 Lista de proyectos procesada:', projectsList);
      setProjects(projectsList);
      
      // Actualizar el proyecto seleccionado con los datos más recientes
      if (selectedProject) {
        const updatedProject = projectsList.find(p => p.id === selectedProject.id);
        if (updatedProject) {
          console.log('🔄 Actualizando proyecto seleccionado:', updatedProject);
          setSelectedProject(updatedProject);
        }
      } else if (projectsList.length > 0) {
        console.log('🎯 Seleccionando primer proyecto:', projectsList[0]);
        setSelectedProject(projectsList[0]);
      }
    } catch (err) {
      console.error('❌ Error al cargar proyectos:', err);
      setError('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async (projectId) => {
    console.log('📁 Cargando archivos para proyecto:', projectId);
    if (!projectId) return;
    
    try {
      setLoading(true);
      const documentsResponse = await getProjectDocuments(projectId);
      console.log('� Respuesta de documentos:', documentsResponse);
      
      const documents = documentsResponse?.documents || [];
      console.log('📄 Documentos del proyecto:', documents);
      
      const project = projects.find(p => p.id === projectId);
      const projectName = project?.name || 'Proyecto sin nombre';
      
      const filesData = documents.map(doc => ({
        name: doc.fileName || doc.name || 'Documento sin nombre',
        type: doc.fileType || 'pdf',
        id: doc.id,
        projectName: projectName,
        size: doc.characterCount || 0,
        createdAt: doc.createdAt
      }));
      
      console.log('📊 Archivos procesados:', filesData);
      setFiles(filesData);
    } catch (error) {
      console.error('❌ Error al cargar documentos del proyecto:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
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
    console.log('📤 Iniciando upload...');
    console.log('Selected file:', selectedFile);
    console.log('Selected project:', selectedProject);
    
    if (!selectedFile || !selectedProject) {
      console.log('⚠️ Upload cancelado: falta archivo o proyecto');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('documents', selectedFile);
      formData.append('projectId', selectedProject.id);
      
      console.log('📦 FormData creado:', {
        file: selectedFile.name,
        projectId: selectedProject.id,
        projectName: selectedProject.name
      });
      
      const result = await uploadDocuments(formData);
      console.log('✅ Upload exitoso:', result);
      
      // Recargar proyectos y archivos del proyecto actual
      await loadProjects();
      if (selectedProject?.id) {
        await loadProjectFiles(selectedProject.id);
      }
      
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('❌ Error al subir archivo:', err);
      setError(`Error: ${err.response?.data?.message || err.message}`);
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

      {loading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          Cargando proyectos...
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
            Proyecto actual:
          </label>
          <select 
            value={selectedProject?.id || ''} 
            onChange={(e) => {
              const project = projects.find(p => p.id === e.target.value);
              console.log('🎯 Proyecto seleccionado:', project);
              setSelectedProject(project);
              setSelectedFiles([]);
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
                {project.name} ({project.documents?.length || project._count?.documents || 0} docs)
              </option>
            ))}
          </select>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <p>No hay proyectos disponibles.</p>
          <button className="add-file-button" onClick={() => setShowProjectModal(true)}>
            <AddIcon className="upload-icon" />
            Crear primer proyecto
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button 
            className="retry-button" 
            onClick={loadProjects}
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

      {!loading && projects.length > 0 && (
        <div className="files-list">
          {files.length === 0 && !error ? (
            <div className="empty-state">
              <p>No hay documentos en este proyecto.</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Sube algunos documentos para comenzar.</p>
              <button className="add-file-button" onClick={handleAddClick} disabled={!selectedProject}>
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
          ) : null}
        </div>
      )}

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