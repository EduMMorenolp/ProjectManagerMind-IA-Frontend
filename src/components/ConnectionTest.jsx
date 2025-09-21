import React, { useState, useEffect } from 'react';
import { getApiInfo, getHealthStatus, getProjects } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState({
    api: 'checking',
    health: 'checking',
    projects: 'checking'
  });
  const [results, setResults] = useState({});

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    // Test API Info
    try {
      const apiInfo = await getApiInfo();
      setStatus(prev => ({ ...prev, api: 'success' }));
      setResults(prev => ({ ...prev, api: apiInfo }));
    } catch (error) {
      setStatus(prev => ({ ...prev, api: 'error' }));
      setResults(prev => ({ ...prev, apiError: error.message }));
    }

    // Test Health Status
    try {
      const health = await getHealthStatus();
      setStatus(prev => ({ ...prev, health: 'success' }));
      setResults(prev => ({ ...prev, health }));
    } catch (error) {
      setStatus(prev => ({ ...prev, health: 'error' }));
      setResults(prev => ({ ...prev, healthError: error.message }));
    }

    // Test Projects
    try {
      const projects = await getProjects();
      setStatus(prev => ({ ...prev, projects: 'success' }));
      setResults(prev => ({ ...prev, projects }));
    } catch (error) {
      setStatus(prev => ({ ...prev, projects: 'error' }));
      setResults(prev => ({ ...prev, projectsError: error.message }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'checking': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>🔧 Prueba de Conectividad Backend</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Estado de Conexiones:</h3>
        <ul>
          <li>{getStatusIcon(status.api)} API Info: {status.api}</li>
          <li>{getStatusIcon(status.health)} Health Check: {status.health}</li>
          <li>{getStatusIcon(status.projects)} Projects: {status.projects}</li>
        </ul>
      </div>

      <button onClick={testConnections} style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        🔄 Probar Nuevamente
      </button>

      <div>
        <h3>Resultados Detallados:</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '4px', 
          overflow: 'auto',
          maxHeight: '400px'
        }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ConnectionTest;