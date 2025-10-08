import React, { useState } from 'react';
import { useAIConfig } from '../../../contexts/AIConfigContext.jsx';
import { AI_PROVIDERS, MOCK_SPEEDS } from '../../../constants/aiProviders.js';
import { clearMockData, seedMockData, regenerateCompleteData } from '../../../services/aiService.js';
import './AISettingsButton.css';

const AISettingsButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    currentProvider, 
    providerConfig, 
    switchProvider, 
    updateConfig, 
    getCurrentProvider,
    getProvidersList,
    isTestMode
  } = useAIConfig();

  const handleProviderSwitch = (providerId) => {
    switchProvider(providerId);
    // Mostrar notificación
    if (providerId === AI_PROVIDERS.TEST.id) {
      console.log('🧪 Modo TEST IA activado - Los documentos serán generados con datos mock');
    } else {
      console.log(`🤖 Proveedor cambiado a: ${AI_PROVIDERS[providerId.toUpperCase()]?.name}`);
    }
  };

  const handleConfigChange = (key, value) => {
    updateConfig({ [key]: value });
  };

  const handleClearMockData = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos de prueba? Esta acción no se puede deshacer.')) {
      try {
        const result = await clearMockData();
        if (result.success) {
          alert('Datos de prueba eliminados exitosamente');
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        alert('Error al eliminar datos: ' + error.message);
      }
    }
  };

  const handleSeedMockData = async () => {
    try {
      const result = await seedMockData();
      if (result.success) {
        alert('Datos de ejemplo creados exitosamente');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error al crear datos de ejemplo: ' + error.message);
    }
  };

  const handleRegenerateCompleteData = async () => {
    try {
      const result = await regenerateCompleteData();
      if (result.success) {
        alert('Datos completos regenerados exitosamente!\nEl proyecto E-commerce Platform ahora tiene todos los documentos.');
        // Recargar la página para refrescar todos los componentes
        window.location.reload();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error al regenerar datos completos: ' + error.message);
    }
  };

  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  const currentProviderInfo = getCurrentProvider();

  return (
    <div className="ai-settings-container">
      {/* Botón principal */}
      <button 
        className={`ai-settings-button ${isTestMode() ? 'test-mode' : 'production-mode'}`}
        onClick={toggleSettings}
        title={`IA Actual: ${currentProviderInfo.name}`}
      >
        <span className="ai-icon">{currentProviderInfo.icon}</span>
        <span className="ai-name">{currentProviderInfo.name}</span>
        <span className="settings-icon">⚙️</span>
      </button>

      {/* Panel de configuración */}
      {isOpen && (
        <div className="ai-settings-panel">
          <div className="ai-settings-header">
            <h3>Configuración de IA</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="ai-settings-content">
            {/* Sección de proveedores */}
            <div className="settings-section">
              <h4>Proveedor de IA</h4>
              <div className="providers-list">
                {getProvidersList().map(provider => (
                  <div 
                    key={provider.id}
                    className={`provider-option ${currentProvider === provider.id ? 'active' : ''}`}
                    onClick={() => handleProviderSwitch(provider.id)}
                  >
                    <div className="provider-icon">{provider.icon}</div>
                    <div className="provider-info">
                      <div className="provider-name">{provider.name}</div>
                      <div className="provider-description">{provider.description}</div>
                    </div>
                    <div className="provider-status">
                      {currentProvider === provider.id && (
                        <span className="active-indicator">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuración específica para Test IA */}
            {isTestMode() && (
              <div className="settings-section test-settings">
                <h4>Configuración de Test IA</h4>
                
                <div className="setting-item">
                  <label>Velocidad de respuesta:</label>
                  <select 
                    value={providerConfig.mockSpeed} 
                    onChange={(e) => handleConfigChange('mockSpeed', e.target.value)}
                  >
                    {Object.entries(MOCK_SPEEDS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={providerConfig.generateErrors}
                      onChange={(e) => handleConfigChange('generateErrors', e.target.checked)}
                    />
                    Simular errores ocasionales
                  </label>
                </div>

                <div className="setting-item">
                  <label>Tasa de éxito:</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={providerConfig.completionRate}
                    onChange={(e) => handleConfigChange('completionRate', parseInt(e.target.value))}
                  />
                  <span>{providerConfig.completionRate}%</span>
                </div>

                {/* Utilidades de datos mock */}
                <div className="mock-utilities">
                  <h5>Utilidades de Datos</h5>
                  <div className="utility-buttons">
                    <button 
                      className="utility-button seed-button"
                      onClick={handleSeedMockData}
                      title="Crear proyectos de ejemplo para testing"
                    >
                      📊 Generar Datos de Ejemplo
                    </button>
                    <button 
                      className="utility-button regenerate-button"
                      onClick={handleRegenerateCompleteData}
                      title="Regenerar datos completos con documentos para todas las etapas"
                    >
                      🔄 Regenerar Datos Completos
                    </button>
                    <button 
                      className="utility-button clear-button"
                      onClick={handleClearMockData}
                      title="Eliminar todos los datos de prueba almacenados"
                    >
                      🗑️ Limpiar Datos de Prueba
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Información del proveedor actual */}
            <div className="settings-section">
              <h4>Estado Actual</h4>
              <div className="current-status">
                <div className="status-item">
                  <strong>Proveedor:</strong> {currentProviderInfo.name}
                </div>
                <div className="status-item">
                  <strong>Tipo:</strong> {currentProviderInfo.type === 'mock' ? 'Testing' : 'Producción'}
                </div>
                <div className="status-item">
                  <strong>Estado:</strong> 
                  <span className={`status-badge ${currentProviderInfo.status}`}>
                    {currentProviderInfo.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Advertencias y tips */}
            <div className="settings-section">
              <div className="settings-tips">
                {isTestMode() ? (
                  <div className="tip warning">
                    <span className="tip-icon">⚠️</span>
                    <div className="tip-content">
                      <strong>Modo Test Activo</strong>
                      <p>Los documentos generados contienen datos mock para testing. No usar en producción.</p>
                    </div>
                  </div>
                ) : (
                  <div className="tip info">
                    <span className="tip-icon">ℹ️</span>
                    <div className="tip-content">
                      <strong>Modo Producción</strong>
                      <p>Los documentos se generan con IA real. Asegúrate de tener configuradas las API keys.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones del panel */}
          <div className="ai-settings-actions">
            <button 
              className="reset-button"
              onClick={() => updateConfig({ mockSpeed: 'normal', generateErrors: false, completionRate: 100 })}
            >
              Resetear configuración
            </button>
            <button 
              className="close-panel-button"
              onClick={() => setIsOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el panel */}
      {isOpen && (
        <div 
          className="ai-settings-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AISettingsButton;