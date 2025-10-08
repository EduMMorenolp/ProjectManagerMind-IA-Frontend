# Guía de Instalación y Configuración

## 🚀 Inicio Rápido

Esta guía te ayudará a configurar el entorno de desarrollo de ProjectManagerMind IA Frontend desde cero.

## 📋 Prerrequisitos

### Herramientas Requeridas

```bash
# Node.js (versión LTS recomendada)
node --version  # v18.17.0 o superior
npm --version   # v9.6.7 o superior

# Git para control de versiones
git --version  # v2.40.0 o superior

# Editor recomendado: VS Code
code --version  # 1.80.0 o superior
```

### Extensiones VS Code Recomendadas

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",          // Tailwind CSS IntelliSense
    "esbenp.prettier-vscode",             // Prettier - Code formatter
    "dbaeumer.vscode-eslint",             // ESLint
    "ms-vscode.vscode-json",              // JSON support
    "christian-kohler.path-intellisense", // Path IntelliSense
    "ms-vscode.vscode-typescript-next",   // TypeScript support
    "formulahendry.auto-rename-tag",      // Auto Rename Tag
    "ms-vscode.vscode-css-peek"           // CSS Peek
  ]
}
```

## 🛠️ Instalación del Proyecto

### 1. Clonar el Repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/EduMMorenolp/Notebook-IA-Develop-Frontend.git
cd Notebook-IA-Develop-Frontend

# O si ya tienes el proyecto localmente
cd d:\Proyectos\Notebook-IA-Develop\frontend
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto frontend:

```bash
# .env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=ProjectManagerMind IA
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true

# Configuración de desarrollo
VITE_MOCK_ENABLED=true
VITE_LOG_LEVEL=debug

# URLs de servicios (opcional)
VITE_GEMINI_API_URL=https://api.gemini.google.com
VITE_OPENAI_API_URL=https://api.openai.com
```

### 4. Verificar Configuración

```bash
# Ejecutar servidor de desarrollo
npm run dev

# Debería mostrar:
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

## ⚙️ Configuración Detallada

### Estructura de Archivos de Configuración

```
frontend/
├── .env                    # Variables de entorno
├── .env.example           # Plantilla de variables
├── eslint.config.js       # Configuración ESLint
├── vite.config.js         # Configuración Vite
├── package.json           # Dependencias y scripts
└── .gitignore            # Archivos ignorados por Git
```

### Configuración de Vite (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 5173,
    host: true,                    // Permite acceso desde red local
    open: true,                    // Abre browser automáticamente
    cors: true,                    # Habilita CORS
    proxy: {
      // Proxy para desarrollo con backend local
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Configuración de build
  build: {
    outDir: 'dist',
    sourcemap: true,               // Source maps para debugging
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting manual
          vendor: ['react', 'react-dom'],
          ui: ['axios'],
          charts: ['mermaid']
        }
      }
    },
    // Optimizaciones
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  },

  // Configuración de resolución de módulos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },

  // Variables de entorno
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});
```

### Configuración de ESLint (`eslint.config.js`)

```javascript
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      
      // Reglas personalizadas
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Reglas de código limpio
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-console': ['warn', { 
        allow: ['warn', 'error'] 
      }],
      'prefer-const': 'error',
      'no-var': 'error'
    },
  },
];
```

## 🔧 Scripts de Desarrollo

### Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",                          // Servidor de desarrollo
    "build": "vite build",                  // Build de producción
    "preview": "vite preview",              // Preview del build
    "lint": "eslint . --ext js,jsx",       // Linting
    "lint:fix": "eslint . --ext js,jsx --fix", // Auto-fix linting
    "clean": "rm -rf dist node_modules",    // Limpiar proyecto
    "analyze": "npm run build && npx vite-bundle-analyzer dist", // Análisis de bundle
    "test": "vitest",                       // Ejecutar tests
    "test:ui": "vitest --ui",              // UI de testing
    "type-check": "tsc --noEmit"           // Verificación de tipos
  }
}
```

### Comandos de Desarrollo Comunes

```bash
# Desarrollo diario
npm run dev                    # Iniciar servidor de desarrollo
npm run lint                   # Verificar código
npm run lint:fix              # Arreglar problemas automáticamente

# Testing
npm run test                   # Ejecutar tests
npm run test:ui               # Interfaz gráfica de tests

# Build y deployment
npm run build                  # Build de producción
npm run preview               # Previsualizar build
npm run analyze               # Analizar tamaño del bundle

# Mantenimiento
npm run clean                  # Limpiar archivos generados
npm audit                     # Verificar vulnerabilidades
npm update                    # Actualizar dependencias
```

## 🌍 Configuración de Entornos

### Desarrollo Local

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
VITE_MOCK_ENABLED=true
VITE_LOG_LEVEL=debug
```

### Staging

```bash
# .env.staging
VITE_API_URL=https://api-staging.projectmanagermind.com
VITE_DEBUG=true
VITE_MOCK_ENABLED=false
VITE_LOG_LEVEL=info
```

### Producción

```bash
# .env.production
VITE_API_URL=https://api.projectmanagermind.com
VITE_DEBUG=false
VITE_MOCK_ENABLED=false
VITE_LOG_LEVEL=error
```

## 🔌 Configuración de Integración con Backend

### Desarrollo con Backend Local

```javascript
// vite.config.js - Configuración de proxy
export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url);
          });
        }
      }
    }
  }
});
```

### Configuración CORS para Desarrollo

```javascript
// Configuración en el backend (si es necesario)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

## 🧪 Configuración de Testing

### Instalación de Vitest

```bash
# Instalar dependencias de testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Configuración de Vitest (`vitest.config.js`)

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    css: true
  }
});
```

### Setup de Testing (`src/test/setup.js`)

```javascript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
```

## 🎨 Configuración de Estilos

### Variables CSS Globales

```css
/* src/styles/base.css */
:root {
  /* Colores principales */
  --primary-color: #007bff;
  --primary-hover: #0056b3;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;

  /* Colores de fondo */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-dark: #343a40;

  /* Tipografía */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;

  /* Bordes y sombras */
  --border-radius: 0.375rem;
  --border-color: #dee2e6;
  --box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --box-shadow-lg: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --border-color: #404040;
  }
}
```

### Configuración de Responsive Design

```css
/* src/styles/responsive.css */
/* Breakpoints */
:root {
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;
}

/* Utilidades responsive */
.container {
  width: 100%;
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (max-width: 768px) {
  .hide-mobile { display: none !important; }
  .container { padding: 0 var(--spacing-sm); }
}

@media (min-width: 769px) {
  .hide-desktop { display: none !important; }
}
```

## 🔒 Configuración de Seguridad

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' http://localhost:3000 https://api.gemini.google.com;
">
```

### Configuración de Headers de Seguridad

```javascript
// vite.config.js
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});
```

## 📊 Configuración de Monitoreo

### Console Logging

```javascript
// src/utils/logger.js
const logger = {
  info: (message, data) => {
    if (import.meta.env.VITE_DEBUG === 'true') {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    
    // En producción, enviar a servicio de monitoreo
    if (import.meta.env.PROD) {
      // Enviar a Sentry, LogRocket, etc.
    }
  },
  
  performance: (operation, duration) => {
    if (import.meta.env.VITE_LOG_LEVEL === 'debug') {
      console.log(`[PERF] ${operation}: ${duration}ms`);
    }
  }
};

export default logger;
```

## 🚨 Troubleshooting Común

### Problemas de Instalación

```bash
# Error de dependencias
rm -rf node_modules package-lock.json
npm install

# Error de permisos (Windows)
npm install --cache .npm

# Error de versión Node.js
nvm use 18.17.0  # o la versión LTS actual
```

### Problemas de Desarrollo

```bash
# Puerto en uso
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173   # Windows

# Limpiar cache de Vite
rm -rf node_modules/.vite
npm run dev

# Problemas de HMR
# Agregar en vite.config.js:
server: {
  watch: {
    usePolling: true
  }
}
```

### Problemas de Build

```bash
# Error de memoria en build
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Verificar salida del build
npm run preview
```

## ✅ Checklist de Configuración

- [ ] **Node.js instalado** (v18.17.0+)
- [ ] **Dependencias instaladas** (`npm install`)
- [ ] **Variables de entorno configuradas** (`.env`)
- [ ] **Servidor de desarrollo funcionando** (`npm run dev`)
- [ ] **ESLint configurado** (sin errores de linting)
- [ ] **Build de producción exitoso** (`npm run build`)
- [ ] **Tests ejecutándose** (`npm run test`)
- [ ] **VS Code con extensiones** recomendadas
- [ ] **Git configurado** para el proyecto
- [ ] **Configuración de proxy** (si usa backend local)

## 📞 Soporte

### Recursos Adicionales

- **Documentación de Vite**: https://vitejs.dev/
- **Documentación de React**: https://react.dev/
- **ESLint Rules**: https://eslint.org/docs/rules/
- **Vitest Documentation**: https://vitest.dev/

### Contacto del Equipo

- **Lead Developer**: [email]
- **DevOps**: [email]
- **QA Team**: [email]

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0