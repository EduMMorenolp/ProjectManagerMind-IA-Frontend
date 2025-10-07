/**
 * Constantes para configuración de proveedores de IA
 */

export const AI_PROVIDERS = {
  GEMINI: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Modelo de IA de Google (Producción)',
    type: 'production',
    icon: '🤖',
    status: 'active'
  },
  TEST: {
    id: 'test',
    name: 'Test IA (Mock)',
    description: 'Generador de documentos de prueba (Testing)',
    type: 'mock',
    icon: '🧪',
    status: 'active'
  },
  OPENAI: {
    id: 'openai',
    name: 'OpenAI GPT',
    description: 'Modelo GPT de OpenAI (Futuro)',
    type: 'production',
    icon: '💬',
    status: 'disabled'
  }
};

export const DEFAULT_CONFIG = {
  testMode: false,
  mockSpeed: 'normal', // slow, normal, fast
  generateErrors: false,
  completionRate: 100
};

export const MOCK_SPEEDS = {
  slow: { delay: 3000, label: 'Lento (3s)' },
  normal: { delay: 1500, label: 'Normal (1.5s)' },
  fast: { delay: 500, label: 'Rápido (0.5s)' }
};