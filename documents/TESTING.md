# Testing y QA

## 🧪 Estrategia de Testing

ProjectManagerMind IA implementa una estrategia de testing comprehensiva que cubre desde pruebas unitarias hasta validación de integración con sistemas de IA. Este documento detalla todos los aspectos del testing en el frontend.

## 📋 Tipos de Testing Implementados

### 1. **Testing de Componentes React**
Pruebas unitarias para todos los componentes principales usando React Testing Library.

### 2. **Testing de Servicios**
Validación de la capa de servicios con mocks y datos reales.

### 3. **Testing de Flujos de Usuario**
Pruebas end-to-end para workflows críticos.

### 4. **Testing de Integración IA**
Validación específica para funcionalidades de IA con proveedores mock.

### 5. **Testing de Performance**
Métricas de rendimiento y optimización.

## 🛠️ Configuración de Testing

### Jest y React Testing Library

```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.stories.jsx',
    '!src/**/*.test.jsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de servicios globales
global.fetch = vi.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
```

### Utilidades de Testing

```javascript
// src/test-utils/index.js
import React from 'react';
import { render } from '@testing-library/react';
import { StudyContext } from '../contexts/StudyContext';

// Wrapper personalizado con contextos
const AllTheProviders = ({ children }) => {
  const mockStudyContext = {
    currentProject: {
      id: 'test-project-1',
      name: 'Proyecto de Prueba',
      description: 'Proyecto para testing'
    },
    documents: [],
    studies: [],
    loading: false,
    error: null,
    // Métodos mock
    setCurrentProject: vi.fn(),
    addDocument: vi.fn(),
    removeDocument: vi.fn(),
    updateStudy: vi.fn()
  };

  return (
    <StudyContext.Provider value={mockStudyContext}>
      {children}
    </StudyContext.Provider>
  );
};

// Función de render personalizada
const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-exportar todo
export * from '@testing-library/react';
export { customRender as render };

// Mock factories
export const createMockProject = (overrides = {}) => ({
  id: 'proj-123',
  name: 'Proyecto Mock',
  description: 'Descripción de prueba',
  createdAt: '2023-01-01T00:00:00Z',
  clientInfo: {
    name: 'Cliente Test',
    sector: 'Tecnología'
  },
  ...overrides
});

export const createMockDocument = (overrides = {}) => ({
  id: 'doc-123',
  filename: 'documento-test.pdf',
  size: 1024000,
  type: 'CLIENTE',
  stage: 'PRELIMINAR',
  uploadedAt: '2023-01-01T00:00:00Z',
  processedAt: null,
  status: 'uploaded',
  ...overrides
});

export const createMockStudy = (type, overrides = {}) => ({
  id: `study-${type}-123`,
  type,
  title: `Estudio ${type}`,
  status: 'completed',
  generatedAt: '2023-01-01T00:00:00Z',
  content: 'Contenido de prueba',
  metadata: {},
  ...overrides
});
```

## 📝 Testing de Componentes

### Testing de Componentes UI

```javascript
// src/components/ui/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '../../../test-utils';
import Button from '../Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button-secondary');
  });

  test('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('button-disabled');
  });

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### Testing de Componentes de Layout

```javascript
// src/components/layout/__tests__/MainLayout.test.jsx
import { render, screen } from '../../../test-utils';
import MainLayout from '../MainLayout';

describe('MainLayout Component', () => {
  test('renders header, main content and footer', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  test('applies correct layout classes', () => {
    const { container } = render(
      <MainLayout className="custom-layout">
        <div>Content</div>
      </MainLayout>
    );

    expect(container.firstChild).toHaveClass('main-layout', 'custom-layout');
  });

  test('handles sidebar visibility', () => {
    const { rerender } = render(
      <MainLayout showSidebar={false}>
        <div>Content</div>
      </MainLayout>
    );

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();

    rerender(
      <MainLayout showSidebar={true}>
        <div>Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });
});
```

### Testing de Componentes de Features

```javascript
// src/components/features/__tests__/ProjectSelector.test.jsx
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import ProjectSelector from '../ProjectSelector';
import { createMockProject } from '../../../test-utils';

// Mock del servicio
vi.mock('../../../services/projectService', () => ({
  getAllProjects: vi.fn(),
  createProject: vi.fn()
}));

describe('ProjectSelector Component', () => {
  const mockProjects = [
    createMockProject({ id: '1', name: 'Proyecto 1' }),
    createMockProject({ id: '2', name: 'Proyecto 2' })
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loads and displays projects', async () => {
    const { getAllProjects } = await import('../../../services/projectService');
    getAllProjects.mockResolvedValue({ success: true, data: mockProjects });

    render(<ProjectSelector onProjectSelect={vi.fn()} />);

    expect(screen.getByText('Cargando proyectos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Proyecto 1')).toBeInTheDocument();
      expect(screen.getByText('Proyecto 2')).toBeInTheDocument();
    });
  });

  test('handles project selection', async () => {
    const { getAllProjects } = await import('../../../services/projectService');
    getAllProjects.mockResolvedValue({ success: true, data: mockProjects });
    
    const onProjectSelect = vi.fn();
    render(<ProjectSelector onProjectSelect={onProjectSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Proyecto 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Proyecto 1'));
    expect(onProjectSelect).toHaveBeenCalledWith(mockProjects[0]);
  });

  test('shows create project modal', async () => {
    const { getAllProjects } = await import('../../../services/projectService');
    getAllProjects.mockResolvedValue({ success: true, data: [] });

    render(<ProjectSelector onProjectSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Crear Nuevo Proyecto')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Crear Nuevo Proyecto'));
    expect(screen.getByTestId('create-project-modal')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    const { getAllProjects } = await import('../../../services/projectService');
    getAllProjects.mockRejectedValue(new Error('API Error'));

    render(<ProjectSelector onProjectSelect={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar proyectos/i)).toBeInTheDocument();
    });
  });
});
```

## 🔧 Testing de Servicios

### Testing de Servicios de API

```javascript
// src/services/__tests__/projectService.test.js
import { projectService } from '../projectService';
import { createMockProject } from '../../test-utils';

// Mock de fetch global
global.fetch = vi.fn();

describe('ProjectService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockClear();
  });

  describe('getAllProjects', () => {
    test('fetches projects successfully', async () => {
      const mockProjects = [createMockProject()];
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockProjects })
      });

      const result = await projectService.getAllProjects();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/projects'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProjects);
    });

    test('handles API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await projectService.getAllProjects();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Error 500');
    });

    test('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await projectService.getAllProjects();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });

  describe('createProject', () => {
    test('creates project with valid data', async () => {
      const newProject = createMockProject();
      const projectData = {
        name: newProject.name,
        description: newProject.description
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: newProject })
      });

      const result = await projectService.createProject(projectData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/projects'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(projectData)
        })
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(newProject);
    });

    test('validates required fields', async () => {
      const result = await projectService.createProject({});

      expect(result.success).toBe(false);
      expect(result.error).toContain('requerido');
    });
  });
});
```

### Testing de Servicios con Mock System

```javascript
// src/services/__tests__/aiService.test.js
import { aiService } from '../aiService';
import { mockAIService } from '../mockAIService';

describe('AIService', () => {
  beforeEach(() => {
    // Configurar modo mock
    localStorage.setItem('ai_provider', 'test');
  });

  describe('processDocuments', () => {
    test('processes documents with mock provider', async () => {
      const mockRequest = {
        documentId: 'doc-123',
        projectId: 'proj-123',
        documentType: 'CLIENTE'
      };

      const result = await aiService.processDocuments(mockRequest);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('content');
      expect(result.data).toHaveProperty('summary');
      expect(result.data).toHaveProperty('keyPoints');
    });

    test('handles different document types', async () => {
      const types = ['CLIENTE', 'RELEVAMIENTO', 'INFORME'];
      
      for (const type of types) {
        const result = await aiService.processDocuments({
          documentId: 'doc-123',
          projectId: 'proj-123',
          documentType: type
        });

        expect(result.success).toBe(true);
        expect(result.data.content).toContain(type.toLowerCase());
      }
    });

    test('simulates processing delays', async () => {
      const startTime = Date.now();
      
      await aiService.processDocuments({
        documentId: 'doc-123',
        projectId: 'proj-123',
        documentType: 'CLIENTE'
      });

      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThan(1000); // Al menos 1 segundo de delay simulado
    });
  });

  describe('generateStudy', () => {
    test('generates different study types', async () => {
      const studyTypes = [
        'relevamiento',
        'ejecutivo',
        'historias',
        'diagramas',
        'sprints',
        'der'
      ];

      for (const type of studyTypes) {
        const result = await aiService.generateStudy('proj-123', type);

        expect(result.success).toBe(true);
        expect(result.data).toHaveProperty('title');
        expect(result.data).toHaveProperty('content');
        expect(result.data.type).toBe(type);
      }
    });
  });

  describe('chatWithDocuments', () => {
    test('handles chat interactions', async () => {
      const chatRequest = {
        message: '¿Cuáles son los requisitos principales?',
        documentContext: ['doc-123'],
        conversationHistory: []
      };

      const result = await aiService.chatWithDocuments(chatRequest);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('response');
      expect(result.data).toHaveProperty('confidence');
      expect(result.data.response).toContain('requisitos');
    });

    test('maintains conversation context', async () => {
      const history = [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: 'Hola, ¿en qué puedo ayudarte?' }
      ];

      const result = await aiService.chatWithDocuments({
        message: 'Continúa con el análisis',
        documentContext: [],
        conversationHistory: history
      });

      expect(result.success).toBe(true);
      expect(result.data.response).toBeDefined();
    });
  });
});
```

## 🧑‍💻 Testing de Flujos de Usuario

### Testing E2E con Playwright

```javascript
// tests/e2e/project-workflow.spec.js
import { test, expect } from '@playwright/test';

test.describe('Project Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar modo mock
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('ai_provider', 'test');
    });
  });

  test('complete project creation and document upload', async ({ page }) => {
    // 1. Crear proyecto
    await page.click('[data-testid="create-project-btn"]');
    await page.fill('[data-testid="project-name"]', 'Proyecto E2E Test');
    await page.fill('[data-testid="project-description"]', 'Proyecto para pruebas E2E');
    await page.click('[data-testid="create-project-submit"]');

    // 2. Verificar navegación
    await expect(page).toHaveURL(/\/project\//);
    await expect(page.locator('h1')).toContainText('Proyecto E2E Test');

    // 3. Subir documento
    await page.click('[data-testid="upload-documents-btn"]');
    
    // Simular selección de archivo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./tests/fixtures/sample-document.pdf');
    
    await page.selectOption('[data-testid="document-type"]', 'CLIENTE');
    await page.selectOption('[data-testid="document-stage"]', 'PRELIMINAR');
    await page.click('[data-testid="upload-submit"]');

    // 4. Verificar subida
    await expect(page.locator('[data-testid="document-list"]')).toContainText('sample-document.pdf');

    // 5. Procesar con IA
    await page.click('[data-testid="process-ai-btn"]');
    await expect(page.locator('[data-testid="processing-status"]')).toContainText('Procesando...');
    
    // Esperar completado (mock tiene delay)
    await expect(page.locator('[data-testid="processing-status"]')).toContainText('Completado', { timeout: 10000 });
  });

  test('generate study workflow', async ({ page }) => {
    // Configurar proyecto con documentos
    await setupProjectWithDocuments(page);

    // 1. Navegar a panel de estudios
    await page.click('[data-testid="studies-tab"]');

    // 2. Generar relevamiento técnico
    await page.click('[data-testid="generate-relevamiento-btn"]');
    
    // 3. Configurar opciones
    await page.check('[data-testid="include-technical-specs"]');
    await page.check('[data-testid="include-recommendations"]');
    await page.click('[data-testid="generate-study-submit"]');

    // 4. Monitorear progreso
    await expect(page.locator('[data-testid="generation-progress"]')).toBeVisible();
    
    // 5. Verificar resultado
    await expect(page.locator('[data-testid="study-result"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="study-title"]')).toContainText('Relevamiento Técnico');

    // 6. Exportar resultado
    await page.click('[data-testid="export-study-btn"]');
    await page.selectOption('[data-testid="export-format"]', 'pdf');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-submit"]');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/relevamiento.*\.pdf$/);
  });

  async function setupProjectWithDocuments(page) {
    // Helper para configurar proyecto con documentos pre-cargados
    await page.evaluate(() => {
      const mockProject = {
        id: 'test-project-1',
        name: 'Proyecto Test',
        documents: [
          {
            id: 'doc-1',
            filename: 'requirements.pdf',
            type: 'CLIENTE',
            stage: 'PRELIMINAR',
            processed: true
          }
        ]
      };
      
      localStorage.setItem('current_project', JSON.stringify(mockProject));
    });
    
    await page.goto('/project/test-project-1');
  }
});
```

### Testing de Interacciones de Usuario

```javascript
// tests/integration/user-interactions.test.jsx
import { render, screen, fireEvent, waitFor } from '../../src/test-utils';
import { StudyPanel } from '../../src/components/features/StudyPanel';
import { createMockProject, createMockDocument } from '../../src/test-utils';

describe('User Interactions', () => {
  const mockProject = createMockProject({
    documents: [
      createMockDocument({ type: 'CLIENTE', stage: 'PRELIMINAR', processed: true }),
      createMockDocument({ type: 'RELEVAMIENTO', stage: 'ANALISIS', processed: true })
    ]
  });

  test('study generation interaction flow', async () => {
    render(<StudyPanel project={mockProject} />);

    // 1. Verificar estado inicial
    expect(screen.getByText('Generar Estudios')).toBeInTheDocument();
    expect(screen.getByText('Relevamiento Técnico')).toBeInTheDocument();

    // 2. Iniciar generación
    const generateBtn = screen.getByTestId('generate-relevamiento');
    fireEvent.click(generateBtn);

    // 3. Verificar modal de configuración
    await waitFor(() => {
      expect(screen.getByTestId('study-config-modal')).toBeInTheDocument();
    });

    // 4. Configurar opciones
    const techSpecsCheckbox = screen.getByLabelText(/especificaciones técnicas/i);
    fireEvent.click(techSpecsCheckbox);

    const recommendationsCheckbox = screen.getByLabelText(/recomendaciones/i);
    fireEvent.click(recommendationsCheckbox);

    // 5. Confirmar generación
    const confirmBtn = screen.getByTestId('confirm-generation');
    fireEvent.click(confirmBtn);

    // 6. Verificar inicio de proceso
    await waitFor(() => {
      expect(screen.getByTestId('generation-progress')).toBeInTheDocument();
    });

    // 7. Esperar completado
    await waitFor(() => {
      expect(screen.getByTestId('study-result')).toBeInTheDocument();
    }, { timeout: 10000 });

    // 8. Verificar contenido generado
    expect(screen.getByText(/relevamiento técnico/i)).toBeInTheDocument();
    expect(screen.getByTestId('study-content')).toHaveTextContent(/especificaciones/i);
  });

  test('document upload and processing flow', async () => {
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    render(<StudyPanel project={mockProject} />);

    // 1. Abrir modal de subida
    fireEvent.click(screen.getByTestId('upload-documents-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
    });

    // 2. Seleccionar archivo
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // 3. Configurar metadata
    const typeSelect = screen.getByTestId('document-type-select');
    fireEvent.change(typeSelect, { target: { value: 'INFORME' } });

    const stageSelect = screen.getByTestId('document-stage-select');
    fireEvent.change(stageSelect, { target: { value: 'DISENO' } });

    // 4. Subir archivo
    const uploadBtn = screen.getByTestId('upload-submit');
    fireEvent.click(uploadBtn);

    // 5. Verificar progreso de subida
    await waitFor(() => {
      expect(screen.getByTestId('upload-progress')).toBeInTheDocument();
    });

    // 6. Verificar completado
    await waitFor(() => {
      expect(screen.getByText(/documento subido exitosamente/i)).toBeInTheDocument();
    });
  });
});
```

## 📊 Testing de Performance

### Métricas de Rendimiento

```javascript
// tests/performance/component-performance.test.jsx
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { StudyPanel } from '../../src/components/features/StudyPanel';
import { createMockProject } from '../../src/test-utils';

describe('Component Performance', () => {
  test('StudyPanel renders within performance budget', () => {
    const project = createMockProject({
      documents: Array.from({ length: 100 }, (_, i) => 
        createMockDocument({ id: `doc-${i}` })
      )
    });

    const startTime = performance.now();
    render(<StudyPanel project={project} />);
    const renderTime = performance.now() - startTime;

    // Debe renderizar en menos de 100ms con 100 documentos
    expect(renderTime).toBeLessThan(100);
  });

  test('memory usage stays within limits', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Renderizar múltiples instancias
    const projects = Array.from({ length: 10 }, () => 
      createMockProject({ documents: Array.from({ length: 50 }, (_, i) => 
        createMockDocument({ id: `doc-${i}` })
      )})
    );

    projects.forEach(project => {
      const { unmount } = render(<StudyPanel project={project} />);
      unmount();
    });

    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Incremento de memoria debe ser razonable (menos de 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});
```

### Testing de Lazy Loading

```javascript
// tests/performance/lazy-loading.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';

describe('Lazy Loading', () => {
  test('loads components on demand', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Verificar que solo se carga el componente inicial
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();

    // Navegar a una ruta que requiere lazy loading
    const projectLink = screen.getByTestId('projects-link');
    fireEvent.click(projectLink);

    // Verificar loading state
    expect(screen.getByTestId('lazy-loading')).toBeInTheDocument();

    // Esperar que se cargue el componente
    await waitFor(() => {
      expect(screen.getByTestId('projects-page')).toBeInTheDocument();
    });

    // Verificar que el loading desaparece
    expect(screen.queryByTestId('lazy-loading')).not.toBeInTheDocument();
  });
});
```

## 🔍 Testing de Integración IA

### Mock de Respuestas IA

```javascript
// tests/ai-integration/ai-responses.test.js
import { aiService } from '../../src/services/aiService';
import { mockAIService } from '../../src/services/mockAIService';

describe('AI Integration Testing', () => {
  beforeEach(() => {
    localStorage.setItem('ai_provider', 'test');
  });

  test('AI responses have consistent structure', async () => {
    const studyTypes = ['relevamiento', 'ejecutivo', 'historias', 'der'];
    
    for (const type of studyTypes) {
      const result = await aiService.generateStudy('proj-123', type);
      
      expect(result).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          type,
          title: expect.any(String),
          content: expect.any(String),
          metadata: expect.any(Object),
          generatedAt: expect.any(String)
        }
      });
    }
  });

  test('AI chat maintains context', async () => {
    const conversation = [
      { role: 'user', content: 'Explica los requisitos del proyecto' },
      { role: 'assistant', content: 'Los requisitos principales son...' },
      { role: 'user', content: '¿Puedes ser más específico sobre el punto 2?' }
    ];

    const result = await aiService.chatWithDocuments({
      message: conversation[2].content,
      conversationHistory: conversation.slice(0, 2),
      documentContext: ['doc-123']
    });

    expect(result.success).toBe(true);
    expect(result.data.response).toContain('punto 2');
  });

  test('AI error handling', async () => {
    // Simular error en servicio mock
    vi.spyOn(mockAIService, 'processDocuments').mockRejectedValueOnce(
      new Error('AI Service Unavailable')
    );

    const result = await aiService.processDocuments({
      documentId: 'doc-123',
      projectId: 'proj-123',
      documentType: 'CLIENTE'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('AI Service Unavailable');
  });
});
```

## 🚀 Automatización de Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json

    - name: Install dependencies
      run: |
        cd frontend
        npm ci

    - name: Run linting
      run: |
        cd frontend
        npm run lint

    - name: Run unit tests
      run: |
        cd frontend
        npm run test:coverage

    - name: Run E2E tests
      run: |
        cd frontend
        npm run test:e2e

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./frontend/coverage/lcov.info
        fail_ci_if_error: true

  performance:
    runs-on: ubuntu-latest
    needs: test

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd frontend
        npm ci

    - name: Build application
      run: |
        cd frontend
        npm run build

    - name: Run Lighthouse CI
      run: |
        cd frontend
        npm install -g @lhci/cli
        lhci autorun
```

### Scripts de Testing

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:perf": "vitest run tests/performance",
    "test:all": "npm run test:run && npm run test:e2e && npm run test:perf"
  }
}
```

## 📈 Métricas y Reportes

### Configuración de Coverage

```javascript
// vitest.config.js
export default {
  test: {
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        'src/main.jsx',
        'src/**/*.stories.jsx'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Umbrales específicos para componentes críticos
        'src/services/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
};
```

### Dashboard de Testing

```javascript
// scripts/generate-test-report.js
import fs from 'fs';
import path from 'path';

async function generateTestReport() {
  const testResults = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      coverage: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
      }
    },
    suites: []
  };

  // Leer resultados de coverage
  const coverageFile = path.join('coverage', 'coverage-summary.json');
  if (fs.existsSync(coverageFile)) {
    const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    testResults.summary.coverage = coverage.total;
  }

  // Generar reporte HTML
  const htmlReport = generateHTMLReport(testResults);
  fs.writeFileSync('test-report.html', htmlReport);

  console.log('Test Report generated: test-report.html');
}

function generateHTMLReport(results) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Test Report - ProjectManagerMind IA</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; }
    .coverage { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .metric { text-align: center; }
    .metric h3 { margin: 0; color: #333; }
    .metric .value { font-size: 2em; font-weight: bold; color: #007acc; }
  </style>
</head>
<body>
  <h1>Test Report</h1>
  <div class="summary">
    <h2>Coverage Summary</h2>
    <div class="coverage">
      <div class="metric">
        <h3>Statements</h3>
        <div class="value">${results.summary.coverage.statements}%</div>
      </div>
      <div class="metric">
        <h3>Branches</h3>
        <div class="value">${results.summary.coverage.branches}%</div>
      </div>
      <div class="metric">
        <h3>Functions</h3>
        <div class="value">${results.summary.coverage.functions}%</div>
      </div>
      <div class="metric">
        <h3>Lines</h3>
        <div class="value">${results.summary.coverage.lines}%</div>
      </div>
    </div>
  </div>
  <p>Generated: ${results.timestamp}</p>
</body>
</html>
  `;
}

generateTestReport().catch(console.error);
```

---

**Mantenido por**: Equipo de QA y Testing  
**Última actualización**: Octubre 2025  
**Cobertura objetivo**: 80% global, 90% servicios críticos