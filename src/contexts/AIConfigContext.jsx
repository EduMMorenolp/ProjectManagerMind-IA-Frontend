import React, { createContext, useState, useEffect } from 'react';
import { AI_PROVIDERS, DEFAULT_CONFIG } from '../constants/aiProviders.js';

/**
 * Contexto para configuración de IA
 * Maneja qué proveedor de IA está activo y sus configuraciones
 */

const AIConfigContext = createContext();

export const AIConfigProvider = ({ children }) => {
  const [currentProvider, setCurrentProvider] = useState(() => {
    // Recuperar configuración guardada o usar Gemini por defecto
    const saved = localStorage.getItem('ai-provider');
    return saved || AI_PROVIDERS.GEMINI.id;
  });

  const [providerConfig, setProviderConfig] = useState(() => {
    const saved = localStorage.getItem('ai-provider-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('ai-provider', currentProvider);
  }, [currentProvider]);

  useEffect(() => {
    localStorage.setItem('ai-provider-config', JSON.stringify(providerConfig));
  }, [providerConfig]);

  const switchProvider = (providerId) => {
    if (AI_PROVIDERS[providerId.toUpperCase()]?.status === 'active') {
      setCurrentProvider(providerId);
      
      // Notificar el cambio
      console.log(`🔄 Cambiando proveedor de IA a: ${AI_PROVIDERS[providerId.toUpperCase()]?.name}`);
      
      // Disparar evento personalizado para que otros componentes puedan reaccionar
      window.dispatchEvent(new CustomEvent('ai-provider-changed', {
        detail: { 
          provider: providerId, 
          config: AI_PROVIDERS[providerId.toUpperCase()] 
        }
      }));
    }
  };

  const updateConfig = (newConfig) => {
    setProviderConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const getCurrentProvider = () => {
    return AI_PROVIDERS[currentProvider.toUpperCase()] || AI_PROVIDERS.GEMINI;
  };

  const isTestMode = () => {
    return currentProvider === AI_PROVIDERS.TEST.id;
  };

  const getProvidersList = () => {
    return Object.values(AI_PROVIDERS).filter(provider => provider.status === 'active');
  };

  const value = {
    currentProvider,
    providerConfig,
    switchProvider,
    updateConfig,
    getCurrentProvider,
    isTestMode,
    getProvidersList,
    AI_PROVIDERS
  };

  return (
    <AIConfigContext.Provider value={value}>
      {children}
    </AIConfigContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAIConfig = () => {
  const context = React.useContext(AIConfigContext);
  if (!context) {
    throw new Error('useAIConfig debe usarse dentro de AIConfigProvider');
  }
  return context;
};

const AIConfigContext_default = AIConfigContext;
export default AIConfigContext_default;