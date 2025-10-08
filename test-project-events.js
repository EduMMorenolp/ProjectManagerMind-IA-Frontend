/**
 * Test para verificar el sistema de eventos project-created
 * Este archivo debe ejecutarse en la consola del navegador
 */

// Función para probar el evento
function testProjectCreatedEvent() {
  console.log('🧪 Iniciando test del sistema de eventos...');
  
  // Simular que se escucha el evento
  const eventListener = (event) => {
    console.log('✅ Evento project-created recibido:', event.detail);
  };
  
  window.addEventListener('project-created', eventListener);
  
  // Simular que se dispara el evento
  const mockProject = {
    id: 'test-123',
    name: 'Proyecto de Test',
    description: 'Proyecto creado desde test'
  };
  
  window.dispatchEvent(new CustomEvent('project-created', {
    detail: { project: mockProject }
  }));
  
  // Limpiar listener después de 2 segundos
  setTimeout(() => {
    window.removeEventListener('project-created', eventListener);
    console.log('🧹 Test completado, listener removido');
  }, 2000);
}

// Ejecutar test
testProjectCreatedEvent();