import { useState, useEffect } from 'react';
import { getProjects, getDocument, downloadDocument } from '../../../services';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects();
        
        if (response.success && response.projects) {
          // Ordenar por fecha de modificación (más reciente primero)
          const sortedProjects = [...response.projects].sort(
            (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
          );
          
          setProjects(sortedProjects);
        }
      } catch (err) {
        console.error('Error al obtener proyectos:', err);
        setError('No se pudieron cargar los proyectos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = async (projectName) => {
    try {
      setSelectedProject(projectName);
      setLoadingDocuments(true);
      setDocuments([]);
      
      // Aquí necesitaríamos un endpoint para obtener todos los documentos de un proyecto
      // Como no existe explícitamente en la documentación, podríamos usar el endpoint de tipos de documentos
      // y luego intentar obtener cada tipo para el proyecto seleccionado
      
      // Este es un enfoque simulado ya que no tenemos un endpoint específico
      const documentTypes = ['relevamiento', 'informe-ejecutivo', 'default'];
      const fetchedDocuments = [];
      
      for (const docType of documentTypes) {
        try {
          const docResponse = await getDocument(projectName, docType);
          if (docResponse.success && docResponse.document) {
            fetchedDocuments.push(docResponse.document);
          }
        } catch (docErr) {
          // Simplemente ignoramos los tipos que no existen para este proyecto
          console.log(`No se encontró documento de tipo ${docType} para el proyecto ${projectName}`);
        }
      }
      
      setDocuments(fetchedDocuments);
    } catch (err) {
      console.error('Error al obtener documentos del proyecto:', err);
      setError(`No se pudieron cargar los documentos del proyecto ${projectName}.`);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDownload = async (projectName, documentId, format) => {
    try {
      await downloadDocument(projectName, documentId, format);
    } catch (err) {
      console.error('Error al descargar documento:', err);
      setError(`No se pudo descargar el documento ${documentId}.`);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando proyectos...</p>
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
      <h1>Proyectos</h1>
      
      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No hay proyectos disponibles.</p>
          <a href="/upload" className="cta-button">Crear un nuevo proyecto</a>
        </div>
      ) : (
        <div className="projects-container">
          <div className="projects-list">
            <h2>Lista de Proyectos</h2>
            
            {projects.map((project) => (
              <div 
                key={project.name} 
                className={`project-item ${selectedProject === project.name ? 'active' : ''}`}
                onClick={() => handleProjectClick(project.name)}
              >
                <div className="project-info">
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-meta">
                    <span className="project-date">
                      Creado: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <span className="project-date">
                      Última modificación: {new Date(project.lastModified).toLocaleDateString()}
                    </span>
                    <span className="project-count">
                      {project.documentsCount} documento(s)
                    </span>
                  </div>
                </div>
                <div className="project-status">
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="project-details">
            {selectedProject ? (
              <>
                <h2>Documentos en {selectedProject}</h2>
                
                {loadingDocuments ? (
                  <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando documentos...</p>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="documents-list">
                    {documents.map((doc) => (
                      <div key={doc.id} className="document-item">
                        <div className="document-info">
                          <h3 className="document-title">{doc.title}</h3>
                          <div className="document-meta">
                            <span>Tipo: {doc.type}</span>
                            <span>Tamaño: {doc.metadata.size} bytes</span>
                            <span>Palabras: {doc.metadata.wordCount}</span>
                            <span>Creado: {new Date(doc.metadata.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="document-actions">
                          <div className="download-options">
                            {doc.availableFormats.map((format) => (
                              <button
                                key={format}
                                className="download-btn"
                                onClick={() => handleDownload(selectedProject, doc.id, format)}
                              >
                                Descargar {format.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No se encontraron documentos procesados para este proyecto.</p>
                )}
              </>
            ) : (
              <div className="empty-state">
                <p>Selecciona un proyecto para ver sus documentos.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;