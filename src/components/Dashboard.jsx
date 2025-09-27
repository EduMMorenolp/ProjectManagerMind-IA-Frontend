import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiInfo, getHealthStatus, getProjects } from '../services';

const Dashboard = () => {
  const [apiInfo, setApiInfo] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Realizar peticiones en paralelo
        const [apiInfoResponse, healthResponse, projectsResponse] = await Promise.all([
          getApiInfo(),
          getHealthStatus(),
          getProjects()
        ]);
        
        setApiInfo(apiInfoResponse);
        setHealthStatus(healthResponse);
        
        // Solo mostrar los 5 proyectos más recientes
        if (projectsResponse.success && projectsResponse.projects) {
          const sortedProjects = [...projectsResponse.projects]
            .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
            .slice(0, 5);
          
          setRecentProjects(sortedProjects);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando información del dashboard...</p>
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
      <h1>Panel de Control</h1>
      
      {apiInfo && (
        <div className="api-info">
          <h2>{apiInfo.message}</h2>
          <p>Versión: {apiInfo.version}</p>
          <p>Estado: {apiInfo.status}</p>
        </div>
      )}
      
      <div className="dashboard">
        {/* Estado del Servidor */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Estado del Servidor</h3>
            {healthStatus && (
              <span className={`status-badge ${healthStatus.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                {healthStatus.status === 'healthy' ? 'Activo' : 'Problemas'}
              </span>
            )}
          </div>
          
          {healthStatus && (
            <div className="card-content">
              <p>Tiempo activo: {healthStatus.uptime}</p>
              <p>Ambiente: {healthStatus.environment}</p>
              <p>Memoria: {healthStatus.memory.used} / {healthStatus.memory.total}</p>
              <div className="services-status">
                <p>Servicios:</p>
                <ul>
                  <li>IA: {healthStatus.services.ai}</li>
                  <li>Almacenamiento: {healthStatus.services.storage}</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="card-footer">
            <Link to="/health">Ver más detalles</Link>
          </div>
        </div>
        
        {/* Proyectos Recientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Proyectos Recientes</h3>
          </div>
          
          <div className="card-content">
            {recentProjects.length > 0 ? (
              <ul className="recent-projects-list">
                {recentProjects.map((project) => (
                  <li key={project.name} className="recent-project-item">
                    <span className="project-name">{project.name}</span>
                    <div className="project-details">
                      <span className="project-date">
                        {new Date(project.lastModified).toLocaleDateString()}
                      </span>
                      <span className={`project-status ${project.status}`}>
                        {project.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay proyectos recientes.</p>
            )}
          </div>
          
          <div className="card-footer">
            <Link to="/projects">Ver todos los proyectos</Link>
          </div>
        </div>
        
        {/* Acciones Rápidas */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Acciones Rápidas</h3>
          </div>
          
          <div className="card-content">
            <div className="quick-actions">
              <Link to="/upload" className="quick-action-btn">
                <span>Subir Documentos</span>
              </Link>
              
              <Link to="/document-types" className="quick-action-btn">
                <span>Ver Tipos de Documentos</span>
              </Link>
              
              <a href="/api/ai/test" target="_blank" rel="noopener noreferrer" className="quick-action-btn">
                <span>Probar Conexión IA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;