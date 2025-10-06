import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const MermaidViewer = ({ 
  diagram, 
  title = "Diagrama", 
  className = "",
  onError,
  height = "400px" 
}) => {
  const mermaidRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState(null);
  const [diagramId] = useState(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Configurar Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#e5e7eb',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f9fafb',
        tertiaryBkg: '#f3f4f6'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      securityLevel: 'loose'
    });
  }, []);

  useEffect(() => {
    if (!diagram || !mermaidRef.current) return;

    const renderDiagram = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Limpiar contenido anterior
        mermaidRef.current.innerHTML = '';
        
        // Validar sintaxis del diagrama
        const isValid = await mermaid.parse(diagram);
        
        if (!isValid) {
          throw new Error('Sintaxis de diagrama inválida');
        }

        // Renderizar el diagrama
        const { svg } = await mermaid.render(diagramId, diagram);
        
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
          
          // Aplicar estilos responsivos al SVG
          const svgElement = mermaidRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error renderizando diagrama Mermaid:', err);
        const errorMessage = `Error al renderizar el diagrama: ${err.message}`;
        setError(errorMessage);
        
        if (onError) {
          onError(errorMessage);
        }
        
        // Mostrar mensaje de error en el contenedor
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="error-message" style="
              padding: 20px;
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              color: #dc2626;
              text-align: center;
            ">
              <h4 style="margin: 0 0 10px 0;">⚠️ Error en el Diagrama</h4>
              <p style="margin: 0; font-size: 14px;">${errorMessage}</p>
            </div>
          `;
        }
        
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [diagram, diagramId, onError]);

  return (
    <div className={`mermaid-viewer ${className}`}>
      {title && (
        <div className="diagram-header" style={{
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h4 style={{
            margin: 0,
            color: '#1f2937',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {title}
          </h4>
        </div>
      )}
      
      <div 
        className="diagram-container"
        style={{
          position: 'relative',
          minHeight: height,
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          padding: '16px',
          overflow: 'auto'
        }}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }}></div>
            <p style={{ margin: 0, fontSize: '14px' }}>Renderizando diagrama...</p>
          </div>
        )}
        
        <div 
          ref={mermaidRef}
          style={{
            minHeight: isLoading ? height : 'auto',
            opacity: isLoading ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .mermaid-viewer .diagram-container svg {
          max-width: 100% !important;
          height: auto !important;
        }
        
        .mermaid-viewer .error-message {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MermaidViewer;