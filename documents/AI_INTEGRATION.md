# Integración con Múltiples Proveedores de IA

## 🤖 Visión General de la Integración IA

ProjectManagerMind IA está diseñado para trabajar con múltiples proveedores de inteligencia artificial de forma transparente, permitiendo cambiar entre diferentes modelos según las necesidades del proyecto o la disponibilidad de los servicios.

## 🎯 Objetivos de la Integración

### 1. **Flexibilidad de Proveedores**
- Soporte para múltiples modelos de IA
- Cambio dinámico entre proveedores
- Fallback automático en caso de fallos

### 2. **Abstracción Unificada**
- API consistente independiente del proveedor
- Misma interfaz para todos los servicios
- Configuración centralizada

### 3. **Desarrollo Independiente**
- Sistema mock completo para desarrollo
- Testing sin dependencias externas
- Demos offline

## 🏭 Arquitectura de Integración

```
AI Integration Architecture
├── Configuration Layer
│   ├── AIConfigContext - Gestión de configuración
│   ├── Provider Detection - Detección automática de modo
│   └── Settings Persistence - Persistencia de configuración
├── Service Layer
│   ├── aiService.js - API unificada
│   ├── Real Providers - Integraciones reales
│   │   ├── Gemini Integration
│   │   ├── OpenAI Integration
│   │   └── Future Providers
│   └── Mock Provider - Sistema de simulación
│       └── mockAIService.js
├── Processing Layer
│   ├── Document Analysis
│   ├── Content Generation
│   ├── Chat Interface
│   └── Specialized Outputs
└── UI Layer
    ├── Provider Selector
    ├── Configuration Modal
    └── Status Indicators
```

## 🔧 Proveedores Soportados

### Google Gemini Pro

**Configuración:**
```javascript
const GEMINI_CONFIG = {
  id: 'gemini',
  name: 'Google Gemini Pro',
  description: 'Modelo avanzado de Google para análisis de documentos y generación de contenido',
  available: true,
  capabilities: [
    'document_analysis',
    'text_generation',
    'conversation',
    'code_generation',
    'multimodal_input'
  ],
  limits: {
    maxTokens: 32000,
    maxFileSize: '20MB',
    supportedFormats: ['pdf', 'docx', 'txt', 'md'],
    requestsPerMinute: 60
  },
  pricing: {
    inputTokens: 0.000125,  // per 1K tokens
    outputTokens: 0.000375  // per 1K tokens
  }
};
```

**Implementación:**
```javascript
// Servicio específico para Gemini
class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-pro';
  }

  async processDocument(documentContent, options = {}) {
    const prompt = this.buildPrompt(documentContent, options);
    
    try {
      const response = await fetch(`${this.baseURL}/models/${this.model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            topK: options.topK || 40,
            topP: options.topP || 0.95,
            maxOutputTokens: options.maxTokens || 4000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatResponse(data);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  buildPrompt(content, options) {
    const { documentType, language = 'es', analysisType = 'comprehensive' } = options;
    
    return `
Analiza el siguiente documento de tipo ${documentType} y genera un análisis ${analysisType} en ${language}.

Documento:
${content}

Instrucciones específicas:
1. Identifica los puntos clave del documento
2. Extrae información relevante para gestión de proyectos
3. Genera recomendaciones técnicas
4. Estructura la respuesta de forma clara y actionable

Formato de respuesta: JSON estructurado con secciones bien definidas.
`;
  }

  formatResponse(geminiResponse) {
    const content = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return {
      success: true,
      data: {
        content,
        metadata: {
          provider: 'gemini',
          model: this.model,
          tokensUsed: geminiResponse.usageMetadata?.totalTokenCount || 0,
          processingTime: Date.now()
        }
      }
    };
  }
}
```

### OpenAI GPT-4

**Configuración:**
```javascript
const OPENAI_CONFIG = {
  id: 'openai',
  name: 'OpenAI GPT-4',
  description: 'Modelo de OpenAI para procesamiento avanzado de lenguaje natural',
  available: true,
  capabilities: [
    'document_analysis',
    'text_generation',
    'conversation',
    'code_generation',
    'reasoning'
  ],
  limits: {
    maxTokens: 128000,
    maxFileSize: '25MB',
    supportedFormats: ['pdf', 'docx', 'txt', 'md', 'csv'],
    requestsPerMinute: 50
  },
  pricing: {
    inputTokens: 0.01,   // per 1K tokens
    outputTokens: 0.03   // per 1K tokens
  }
};
```

**Implementación:**
```javascript
class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4-turbo-preview';
  }

  async processDocument(documentContent, options = {}) {
    const messages = this.buildMessages(documentContent, options);
    
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 4000,
          response_format: options.responseFormat || { type: 'text' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const data = await response.json();
      return this.formatResponse(data);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  buildMessages(content, options) {
    const { documentType, analysisType = 'comprehensive' } = options;
    
    return [
      {
        role: 'system',
        content: `Eres un analista experto en gestión de proyectos de software. Tu tarea es analizar documentos y generar insights útiles para la planificación y desarrollo de proyectos.`
      },
      {
        role: 'user',
        content: `
Analiza el siguiente documento de tipo ${documentType} y proporciona un análisis ${analysisType}.

Documento:
${content}

Por favor, estructura tu respuesta en formato JSON con las siguientes secciones:
- resumen: Resumen ejecutivo del documento
- puntosClave: Array de puntos clave identificados
- recomendaciones: Array de recomendaciones técnicas
- riesgos: Array de riesgos identificados
- estimaciones: Estimaciones de tiempo y recursos si aplicable
`
      }
    ];
  }

  formatResponse(openaiResponse) {
    const content = openaiResponse.choices?.[0]?.message?.content;
    
    return {
      success: true,
      data: {
        content,
        metadata: {
          provider: 'openai',
          model: this.model,
          tokensUsed: openaiResponse.usage?.total_tokens || 0,
          processingTime: Date.now()
        }
      }
    };
  }
}
```

### Test IA (Mock Provider)

**Configuración:**
```javascript
const TEST_CONFIG = {
  id: 'test',
  name: 'Test IA (Mock)',
  description: 'Simulador completo para desarrollo y testing sin dependencias externas',
  available: true,
  capabilities: [
    'document_analysis',
    'text_generation',
    'conversation',
    'mock_processing',
    'offline_operation'
  ],
  limits: {
    maxTokens: 100000,
    maxFileSize: '50MB',
    supportedFormats: ['pdf', 'docx', 'txt', 'md', 'csv', 'json'],
    requestsPerMinute: 1000
  },
  pricing: {
    inputTokens: 0,
    outputTokens: 0
  }
};
```

## 🔄 Sistema de Detección y Switching

### Detección Automática de Modo

```javascript
// Función central de detección
export const isTestMode = () => {
  const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
  return config.provider === AI_PROVIDERS.TEST.id;
};

// Aplicación en servicios
export const processDocuments = async (data) => {
  try {
    if (isTestMode()) {
      console.log('🧪 Procesando documentos en modo test');
      return await mockAIService.processDocuments(data);
    }

    // Determinar proveedor activo
    const config = JSON.parse(localStorage.getItem('aiConfig') || '{}');
    const provider = config.provider || 'gemini';

    switch (provider) {
      case 'gemini':
        return await geminiService.processDocuments(data);
      case 'openai':
        return await openaiService.processDocuments(data);
      default:
        throw new Error(`Proveedor no soportado: ${provider}`);
    }
  } catch (error) {
    console.error('Error al procesar documentos:', error);
    
    // Fallback a modo mock en caso de error
    if (!isTestMode()) {
      console.warn('⚠️ Fallback a modo mock por error en proveedor');
      return await mockAIService.processDocuments(data);
    }
    
    throw error;
  }
};
```

### Cambio Dinámico de Proveedores

```javascript
// Componente selector de proveedor
const ProviderSelector = () => {
  const { config, updateProvider, getCurrentProvider } = useAIConfig();
  const currentProvider = getCurrentProvider();

  const handleProviderChange = async (newProviderId) => {
    try {
      // Verificar disponibilidad del proveedor
      const provider = AI_PROVIDERS[newProviderId.toUpperCase()];
      if (!provider?.available) {
        throw new Error(`Proveedor ${newProviderId} no disponible`);
      }

      // Actualizar configuración
      updateProvider(newProviderId);

      // Notificar cambio
      showNotification(`Proveedor cambiado a ${provider.name}`, 'success');

      // Log para debugging
      console.log(`🔄 Proveedor IA actualizado: ${provider.name}`);
    } catch (error) {
      console.error('Error al cambiar proveedor:', error);
      showNotification('Error al cambiar proveedor de IA', 'error');
    }
  };

  return (
    <div className="provider-selector">
      <label htmlFor="ai-provider">Proveedor de IA:</label>
      <select
        id="ai-provider"
        value={currentProvider.id}
        onChange={(e) => handleProviderChange(e.target.value)}
        className="provider-select"
      >
        {Object.values(AI_PROVIDERS).map(provider => (
          <option 
            key={provider.id} 
            value={provider.id}
            disabled={!provider.available}
          >
            {provider.name} {!provider.available && '(No disponible)'}
          </option>
        ))}
      </select>
      
      <div className="provider-info">
        <p><strong>Descripción:</strong> {currentProvider.description}</p>
        <p><strong>Capacidades:</strong> {currentProvider.capabilities?.join(', ')}</p>
        {currentProvider.limits && (
          <p><strong>Límites:</strong> 
            Tokens: {currentProvider.limits.maxTokens}, 
            Archivo: {currentProvider.limits.maxFileSize}
          </p>
        )}
      </div>
    </div>
  );
};
```

## 🎨 Personalización por Proveedor

### Configuraciones Específicas

```javascript
// Configuraciones específicas por proveedor
const PROVIDER_CONFIGS = {
  gemini: {
    defaultParams: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxTokens: 4000
    },
    specialFeatures: {
      multimodal: true,
      codeGeneration: true,
      largeContext: true
    },
    prompts: {
      analysisPrefix: "Como experto en análisis de documentos técnicos...",
      language: "es",
      outputFormat: "json"
    }
  },
  
  openai: {
    defaultParams: {
      temperature: 0.7,
      maxTokens: 4000,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    specialFeatures: {
      functionCalling: true,
      reasoning: true,
      codeInterpreter: true
    },
    prompts: {
      systemRole: "Eres un analista técnico experto...",
      responseFormat: { type: "json_object" }
    }
  },
  
  test: {
    defaultParams: {
      speed: 'normal',
      realism: 'high',
      dataSet: 'comprehensive'
    },
    specialFeatures: {
      offlineMode: true,
      deterministicOutputs: true,
      unlimitedRequests: true
    },
    prompts: {
      mockResponses: true,
      contextAware: true
    }
  }
};
```

### Adaptación de Prompts

```javascript
// Sistema de prompts adaptativo
class PromptAdapter {
  static adaptForProvider(basePrompt, provider, options = {}) {
    const config = PROVIDER_CONFIGS[provider];
    
    switch (provider) {
      case 'gemini':
        return this.adaptForGemini(basePrompt, config, options);
      case 'openai':
        return this.adaptForOpenAI(basePrompt, config, options);
      case 'test':
        return this.adaptForTest(basePrompt, config, options);
      default:
        return basePrompt;
    }
  }

  static adaptForGemini(prompt, config, options) {
    return `${config.prompts.analysisPrefix}

${prompt}

Instrucciones específicas para Gemini:
- Utiliza tu capacidad multimodal si es necesario
- Genera código cuando sea apropiado
- Aprovecha el contexto largo disponible
- Responde en formato ${config.prompts.outputFormat}
- Idioma: ${config.prompts.language}`;
  }

  static adaptForOpenAI(prompt, config, options) {
    return {
      system: config.prompts.systemRole,
      user: `${prompt}

Instrucciones específicas para GPT-4:
- Utiliza razonamiento paso a paso
- Aplica function calling si es necesario
- Estructura la respuesta según el formato solicitado`,
      responseFormat: config.prompts.responseFormat
    };
  }

  static adaptForTest(prompt, config, options) {
    return `MOCK MODE: ${prompt}

Configuración de simulación:
- Velocidad: ${config.defaultParams.speed}
- Realismo: ${config.defaultParams.realism}
- Dataset: ${config.defaultParams.dataSet}
- Respuestas contextuales: ${config.prompts.contextAware}`;
  }
}
```

## 📊 Monitoreo y Análisis

### Métricas de Uso por Proveedor

```javascript
class AIUsageTracker {
  constructor() {
    this.metrics = this.loadMetrics();
  }

  trackRequest(provider, operation, metadata = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      provider,
      operation,
      tokensUsed: metadata.tokensUsed || 0,
      processingTime: metadata.processingTime || 0,
      success: metadata.success !== false
    };

    // Agregar a métricas
    if (!this.metrics[provider]) {
      this.metrics[provider] = [];
    }
    
    this.metrics[provider].push(entry);
    
    // Mantener solo últimas 1000 entradas por proveedor
    if (this.metrics[provider].length > 1000) {
      this.metrics[provider] = this.metrics[provider].slice(-1000);
    }

    this.saveMetrics();
    this.updateRealTimeStats(provider, entry);
  }

  getUsageStats(provider, timeRange = '24h') {
    const entries = this.metrics[provider] || [];
    const cutoff = this.getTimeRangeCutoff(timeRange);
    const recentEntries = entries.filter(e => new Date(e.timestamp) > cutoff);

    return {
      provider,
      timeRange,
      totalRequests: recentEntries.length,
      successfulRequests: recentEntries.filter(e => e.success).length,
      totalTokens: recentEntries.reduce((sum, e) => sum + e.tokensUsed, 0),
      averageProcessingTime: this.calculateAverage(recentEntries, 'processingTime'),
      operationBreakdown: this.getOperationBreakdown(recentEntries),
      errorRate: this.calculateErrorRate(recentEntries)
    };
  }

  getAllProvidersStats(timeRange = '24h') {
    return Object.keys(this.metrics).map(provider => 
      this.getUsageStats(provider, timeRange)
    );
  }

  loadMetrics() {
    try {
      return JSON.parse(localStorage.getItem('aiUsageMetrics') || '{}');
    } catch {
      return {};
    }
  }

  saveMetrics() {
    try {
      localStorage.setItem('aiUsageMetrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('No se pudieron guardar las métricas de uso:', error);
    }
  }
}

// Instancia global del tracker
export const aiUsageTracker = new AIUsageTracker();
```

### Dashboard de Estado de Proveedores

```javascript
const AIProviderDashboard = () => {
  const [stats, setStats] = useState([]);
  const [timeRange, setTimeRange] = useState('24h');
  const { getCurrentProvider } = useAIConfig();

  useEffect(() => {
    const loadStats = () => {
      const allStats = aiUsageTracker.getAllProvidersStats(timeRange);
      setStats(allStats);
    };

    loadStats();
    const interval = setInterval(loadStats, 30000); // Actualizar cada 30s

    return () => clearInterval(interval);
  }, [timeRange]);

  const currentProvider = getCurrentProvider();

  return (
    <div className="ai-dashboard">
      <h2>Estado de Proveedores IA</h2>
      
      <div className="current-provider">
        <h3>Proveedor Activo</h3>
        <div className="provider-card active">
          <span className="provider-name">{currentProvider.name}</span>
          <span className="provider-status">Activo</span>
        </div>
      </div>

      <div className="time-range-selector">
        <label>Período:</label>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="1h">Última hora</option>
          <option value="24h">Últimas 24 horas</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
      </div>

      <div className="providers-stats">
        {stats.map(stat => (
          <div key={stat.provider} className="provider-stat-card">
            <h4>{AI_PROVIDERS[stat.provider.toUpperCase()]?.name || stat.provider}</h4>
            <div className="stats-grid">
              <div className="stat">
                <span className="label">Requests:</span>
                <span className="value">{stat.totalRequests}</span>
              </div>
              <div className="stat">
                <span className="label">Success Rate:</span>
                <span className="value">{(100 - stat.errorRate).toFixed(1)}%</span>
              </div>
              <div className="stat">
                <span className="label">Tokens:</span>
                <span className="value">{stat.totalTokens.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="label">Avg. Time:</span>
                <span className="value">{stat.averageProcessingTime.toFixed(0)}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 🔮 Roadmap de Proveedores

### Proveedores Futuros

#### Anthropic Claude
```javascript
const CLAUDE_CONFIG = {
  id: 'claude',
  name: 'Anthropic Claude',
  description: 'Modelo de Anthropic especializado en análisis detallado y razonamiento',
  status: 'planned',
  capabilities: [
    'document_analysis',
    'reasoning',
    'safety_focused',
    'long_context'
  ]
};
```

#### Azure OpenAI
```javascript
const AZURE_OPENAI_CONFIG = {
  id: 'azure-openai',
  name: 'Azure OpenAI Service',
  description: 'Servicio empresarial de OpenAI con garantías de SLA',
  status: 'planned',
  capabilities: [
    'enterprise_security',
    'compliance',
    'custom_models',
    'dedicated_capacity'
  ]
};
```

#### Modelos Locales (Ollama)
```javascript
const LOCAL_MODEL_CONFIG = {
  id: 'ollama',
  name: 'Modelo Local (Ollama)',
  description: 'Modelos ejecutados localmente para máxima privacidad',
  status: 'planned',
  capabilities: [
    'offline_operation',
    'privacy_focused',
    'customizable',
    'no_api_costs'
  ]
};
```

---

**Mantenido por**: Equipo de Integración IA  
**Última actualización**: Octubre 2025