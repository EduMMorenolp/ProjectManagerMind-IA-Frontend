import React from 'react';
import { DiagramasFlujoViewer } from '../components/features/DiagramViewer';

const TestDiagramsPage = () => {
  const handleSuccess = (message) => {
    console.log('Success:', message);
    alert(`Éxito: ${message}`);
  };

  const handleError = (message) => {
    console.error('Error:', message);
    alert(`Error: ${message}`);
  };

  // ID de proyecto de prueba (usar un ID real de tu BD)
  const testProjectId = 1;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🧪 Prueba de Diagramas de Flujo</h1>
      <p>Esta página es para probar el componente DiagramasFlujoViewer</p>
      
      <DiagramasFlujoViewer
        projectId={testProjectId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default TestDiagramsPage;