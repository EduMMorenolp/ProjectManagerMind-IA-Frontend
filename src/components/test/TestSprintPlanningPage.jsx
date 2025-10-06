import React from 'react';
import { SprintPlanningViewer } from '../components/features/SprintPlanning';

const TestSprintPlanningPage = () => {
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
      <h1>🧪 Prueba de Planificación de Sprints</h1>
      <p>Esta página es para probar el componente SprintPlanningViewer</p>
      
      <SprintPlanningViewer
        projectId={testProjectId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default TestSprintPlanningPage;