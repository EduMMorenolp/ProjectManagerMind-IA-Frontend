import React from 'react';
import DERViewer from './DERViewer';

/**
 * Componente de ejemplo hardcodeado para probar DERViewer
 * Útil para desarrollo y testing sin necesidad de archivos reales
 */
const DERViewerHardcoded = () => {
  // Datos de ejemplo simulando documentos extraídos
  const mockExtractedTexts = [
    {
      filename: 'relevamiento_sistema_ventas.pdf',
      content: `
        RELEVAMIENTO SISTEMA DE VENTAS
        
        El sistema debe gestionar la información de clientes, productos y ventas.
        
        CLIENTES:
        - Cada cliente tiene nombre, apellido, email, teléfono y dirección
        - Los clientes pueden tener múltiples direcciones de entrega
        - Se debe registrar la fecha de registro del cliente
        - Los clientes pueden estar activos o inactivos
        
        PRODUCTOS:
        - Los productos tienen código, nombre, descripción y precio
        - Cada producto pertenece a una categoría
        - Se debe controlar el stock disponible
        - Los productos pueden tener descuentos especiales
        
        VENTAS:
        - Cada venta se realiza a un cliente específico
        - Una venta puede incluir múltiples productos con diferentes cantidades
        - Se debe registrar fecha y hora de la venta
        - Las ventas tienen estados: pendiente, confirmada, enviada, entregada
        - Se debe calcular el total de la venta
        
        CATEGORÍAS:
        - Las categorías tienen nombre y descripción
        - Una categoría puede tener subcategorías
        
        EMPLEADOS:
        - Los empleados procesan las ventas
        - Tienen nombre, cargo, fecha de ingreso
        - Se debe registrar qué empleado realizó cada venta
        
        PROVEEDORES:
        - Los productos son suministrados por proveedores
        - Cada proveedor tiene nombre, contacto y dirección
        - Un producto puede ser suministrado por múltiples proveedores
        
        COMPRAS:
        - Se registran las compras a proveedores
        - Cada compra incluye productos y cantidades
        - Se debe controlar el estado de las compras
      `,
      type: 'relevamiento',
      size: 2048
    },
    {
      filename: 'analisis_funcional.docx',
      content: `
        ANÁLISIS FUNCIONAL - MÓDULO DE INVENTARIO
        
        El sistema debe mantener un control detallado del inventario:
        
        ALMACENES:
        - El sistema maneja múltiples almacenes
        - Cada almacén tiene ubicación, capacidad y tipo
        - Los productos se almacenan en ubicaciones específicas
        
        MOVIMIENTOS DE STOCK:
        - Se registran todos los movimientos: entradas, salidas, transferencias
        - Cada movimiento tiene fecha, cantidad, motivo y responsable
        - Se debe mantener historial completo de movimientos
        
        INVENTARIOS:
        - Se realizan inventarios periódicos para verificar stock
        - Se registran diferencias encontradas y ajustes realizados
        
        UBICACIONES:
        - Cada producto en almacén tiene una ubicación específica
        - Las ubicaciones tienen código y descripción (estantería, nivel, posición)
        
        LOTES:
        - Los productos pueden manejarse por lotes
        - Cada lote tiene número, fecha de vencimiento y cantidad
        - Se debe controlar FIFO (First In, First Out)
        
        RESERVAS:
        - Se pueden reservar productos para ventas futuras
        - Las reservas tienen fecha límite y pueden cancelarse
      `,
      type: 'analisis',
      size: 1456
    }
  ];

  const mockProjectInfo = {
    id: 'proj_001',
    name: 'Sistema de Gestión Comercial'
  };

  const handleDERGenerated = (derData) => {
    console.log('DER generado (ejemplo hardcodeado):', derData);
    // En una implementación real, aquí se guardaría en el estado global
  };

  const handleDERError = (error) => {
    console.error('Error en DER (ejemplo hardcodeado):', error);
    // En una implementación real, aquí se mostraría el error al usuario
  };

  return (
    <div className="der-hardcoded-example">
      <div className="example-header">
        <h2>🧪 DER Viewer - Ejemplo Hardcodeado</h2>
        <p className="example-description">
          Este componente muestra el funcionamiento del generador de DER con datos de ejemplo.
          En la implementación real, los datos vendrían de archivos subidos por el usuario.
        </p>
        
        <div className="mock-data-info">
          <h4>📄 Datos de ejemplo:</h4>
          <ul>
            <li><strong>relevamiento_sistema_ventas.pdf</strong> - Documento de relevamiento con entidades del negocio</li>
            <li><strong>analisis_funcional.docx</strong> - Análisis funcional del módulo de inventario</li>
          </ul>
        </div>
      </div>

      <DERViewer
        projectId={mockProjectInfo.id}
        projectName={mockProjectInfo.name}
        extractedTexts={mockExtractedTexts}
        onDERGenerated={handleDERGenerated}
        onError={handleDERError}
        initialConfig={{
          motor: 'postgresql',
          incluirIndices: true,
          incluirConstraints: true,
          incluirVistas: true,
          incluirProcedimientos: false,
          notacion: 'crow_foot',
          nivelNormalizacion: '3NF'
        }}
      />
    </div>
  );
};

export default DERViewerHardcoded;