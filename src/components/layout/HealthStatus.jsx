import { useState, useEffect } from 'react';
import { getHealthStatus, testAI, getAIInfo } from '../../services';

const HealthStatus = () => {
  const [healthData, setHealthData] = useState(null);
  const [aiTest, setAiTest] = useState(null);
  const [aiInfo, setAiInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Realizar peticiones en paralelo
      const [healthResponse, aiTestResponse, aiInfoResponse] = await Promise.all([
        getHealthStatus(),
        testAI(),
        getAIInfo()
      ]);
      
      setHealthData(healthResponse);
      setAiTest(aiTestResponse);
      setAiInfo(aiInfoResponse);
    } catch (err) {
      console.error('Error al obtener datos de estado:', err);
      setError('No se pudieron cargar los datos de estado. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealthData();
  };

  if (loading && !refreshing) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando información de estado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleRefresh}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h1>Estado del Sistema</h1>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="refresh-btn"
        >
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      
      {refreshing && (
        <div className="refresh-indicator">
          <div className="loading-spinner-small"></div>
          <p>Actualizando datos...</p>
        </div>
      )}
      
      <div className="status-dashboard">
        {/* Estado del Servidor */}
        <div className="status-card server-status">
          <h2>Estado del Servidor</h2>
          
          {healthData && (
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Estado:</span>
                <span className={`status-value ${healthData.status}`}>
                  {healthData.status === 'healthy' ? 'Saludable' : 'Con problemas'}
                </span>
              </div>
              
              <div className="status-item">
                <span className="status-label">Tiempo activo:</span>
                <span className="status-value">{healthData.uptime}</span>
              </div>
              
              <div className="status-item">
                <span className="status-label">Entorno:</span>
                <span className="status-value">{healthData.environment}</span>
              </div>
              
              <div className="status-item">
                <span className="status-label">Memoria:</span>
                <span className="status-value">
                  {healthData.memory.used} / {healthData.memory.total}
                </span>
              </div>
              
              <div className="status-item">
                <span className="status-label">Última actualización:</span>
                <span className="status-value">
                  {new Date(healthData.timestamp).toLocaleString()}
                </span>
              </div>
              
              <h3>Servicios</h3>
              <div className="services-list">
                <div className="service-item">
                  <span className="service-name">IA:</span>
                  <span className={`service-status ${healthData.services.ai}`}>
                    {healthData.services.ai}
                  </span>
                </div>
                
                <div className="service-item">
                  <span className="service-name">Almacenamiento:</span>
                  <span className={`service-status ${healthData.services.storage}`}>
                    {healthData.services.storage}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Estado de la IA */}
        <div className="status-card ai-status">
          <h2>Estado de la IA</h2>
          
          {aiTest && (
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Conexión:</span>
                <span className={`status-value ${aiTest.success ? 'success' : 'error'}`}>
                  {aiTest.success ? 'Exitosa' : 'Con problemas'}
                </span>
              </div>
              
              {aiTest.success ? (
                <>
                  <div className="status-item">
                    <span className="status-label">Modelo:</span>
                    <span className="status-value">{aiTest.model.name}</span>
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Estado del modelo:</span>
                    <span className={`status-value ${aiTest.model.status}`}>
                      {aiTest.model.status}
                    </span>
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Tiempo de respuesta:</span>
                    <span className="status-value">{aiTest.model.responseTime}</span>
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Respuesta de prueba:</span>
                    <span className="status-value test-response">
                      "{aiTest.testResponse}"
                    </span>
                  </div>
                </>
              ) : (
                <div className="error-details">
                  <div className="status-item">
                    <span className="status-label">Error:</span>
                    <span className="status-value">{aiTest.error}</span>
                  </div>
                  
                  <div className="status-item">
                    <span className="status-label">Detalles:</span>
                    <span className="status-value">{aiTest.details}</span>
                  </div>
                  
                  <div className="suggestions">
                    <h4>Sugerencias:</h4>
                    <ul>
                      {aiTest.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Información de la IA */}
        <div className="status-card ai-info">
          <h2>Información del Modelo de IA</h2>
          
          {aiInfo && aiInfo.success && (
            <div className="status-details">
              <div className="status-item">
                <span className="status-label">Nombre del modelo:</span>
                <span className="status-value">{aiInfo.modelInfo.modelName}</span>
              </div>
              
              <div className="status-item">
                <span className="status-label">Proveedor:</span>
                <span className="status-value">{aiInfo.modelInfo.provider}</span>
              </div>
              
              <div className="status-item">
                <span className="status-label">URL base:</span>
                <span className="status-value url">{aiInfo.modelInfo.baseUrl}</span>
              </div>
              
              <div className="status-item">
                <span className="status-label">Estado:</span>
                <span className={`status-value ${aiInfo.modelInfo.status}`}>
                  {aiInfo.modelInfo.status}
                </span>
              </div>
              
              <h3>Capacidades</h3>
              <div className="capabilities-list">
                {Object.entries(aiInfo.capabilities).map(([capability, supported]) => (
                  <div key={capability} className="capability-item">
                    <span className="capability-name">
                      {capability.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                    </span>
                    <span className={`capability-status ${supported ? 'supported' : 'not-supported'}`}>
                      {supported ? 'Sí' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
              
              <h3>Tipos de Documentos Disponibles</h3>
              <div className="document-types-list">
                {aiInfo.availableDocumentTypes.map((type) => (
                  <div key={type} className="document-type-item">
                    {type}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthStatus;