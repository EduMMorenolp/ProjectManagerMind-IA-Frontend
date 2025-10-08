import React, { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getDocument } from '../../../services/documentService';
import { CloseIcon, PdfIcon, DocIcon } from '../Icons';
import '../../../styles/upload-modal.css';
import '../../../styles/components/DocumentModal.css';

const DocumentModal = ({ isOpen, onClose, document, onEdit, onDelete, mode = 'view' }) => {
  const [documentContent, setDocumentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [editedContent, setEditedContent] = useState('');
  const [viewMode, setViewMode] = useState('rendered'); // 'rendered' o 'raw'

  const loadDocumentContent = useCallback(async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDocument(document.projectName, document.id);
      
      // Obtener el contenido del documento
      const content = response.content || 
                     response.extractedText || 
                     response.data?.content ||
                     response.data?.extractedText ||
                     'No hay contenido disponible para este documento';
      
      setDocumentContent(content);
      setEditedContent(content);
    } catch (err) {
      console.error('Error al cargar documento:', err);
      setError('Error al cargar el contenido del documento');
      setDocumentContent('Error al cargar el documento');
    } finally {
      setLoading(false);
    }
  }, [document]);

  useEffect(() => {
    if (isOpen && document) {
      loadDocumentContent();
    }
  }, [isOpen, document, loadDocumentContent]);

  const handleSave = async () => {
    if (onEdit) {
      try {
        await onEdit(document.id, editedContent);
        setDocumentContent(editedContent);
        setIsEditing(false);
      } catch (err) {
        console.error('Error al guardar cambios:', err);
        setError('Error al guardar los cambios');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el documento "${document.name}"?`)) {
      if (onDelete) {
        try {
          await onDelete(document.id);
          onClose();
        } catch (err) {
          console.error('Error al eliminar documento:', err);
          setError('Error al eliminar el documento');
        }
      }
    }
  };

  const convertMarkdownToPlainText = (content) => {
    return content
      .replace(/^#{1,6}\s+/gm, '') // Remover headers (#, ##, ###, etc.)
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remover bold (**texto**)
      .replace(/\*(.*?)\*/g, '$1') // Remover italic (*texto*)
      .replace(/`(.*?)`/g, '$1') // Remover code inline (`código`)
      .replace(/```[\s\S]*?```/g, '') // Remover code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convertir links [texto](url) a solo texto
      .replace(/^\s*[-*+]\s+/gm, '• ') // Convertir listas (-, *, +) a bullets
      .replace(/^\s*\d+\.\s+/gm, '• ') // Convertir listas numeradas (1., 2.) a bullets
      .replace(/^---+$/gm, '') // Remover líneas horizontales (---)
      .replace(/^\|.*\|$/gm, '') // Remover filas de tablas (|col1|col2|)
      .replace(/^\s*\|[-\s|:]+\|$/gm, '') // Remover separadores de tablas (|---|---|)
      .replace(/Ø=ÜÞ/g, '') // Remover caracteres especiales extraños
      .replace(/>/g, '') // Remover citas (>)
      .replace(/^\s*$/gm, '') // Remover líneas completamente vacías
      .replace(/\n{3,}/g, '\n\n') // Reducir múltiples líneas vacías a máximo 2
      .trim();
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // Si el contenido no está disponible, intentar recargarlo
      if (!documentContent || documentContent === 'Cargando contenido...' || documentContent === 'Error al cargar el documento' || documentContent.trim() === '') {
        await loadDocumentContent();
        
        // Verificar nuevamente después de la recarga
        if (!documentContent || documentContent === 'Cargando contenido...' || documentContent === 'Error al cargar el documento' || documentContent.trim() === '') {
          setError('El contenido del documento no se pudo cargar. Por favor, cierra y vuelve a abrir el modal.');
          return;
        }
      }
      
      // Obtener el elemento que contiene el contenido del documento
      const contentElement = window.document.querySelector('.markdown-content') || 
                           window.document.querySelector('.document-content') ||
                           window.document.querySelector('[style*="white-space: pre-wrap"]');
      
      if (!contentElement) {
        // Si no hay elemento visual, crear un PDF con texto plano
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - (margin * 2);
        
        // Título del documento
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text(document.name || 'Documento', margin, margin + 10);
        
        // Para archivos Markdown, convertir a texto plano sin sintaxis Markdown
        let contentForPdf = documentContent;
        if (isMarkdownFile) {
          contentForPdf = convertMarkdownToPlainText(documentContent);
        }
        
        // Contenido del documento
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        
        const lines = pdf.splitTextToSize(contentForPdf, maxWidth);
        let yPosition = margin + 30;
        
        lines.forEach((line) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 5;
        });
        
        pdf.save(`${document.name || 'documento'}.pdf`);
      } else {
        try {
          // Intentar usar html2canvas para capturar el contenido visual
          const canvas = await html2canvas(contentElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            ignoreElements: (element) => {
              // Ignorar elementos que puedan tener colores problemáticos
              const style = window.getComputedStyle(element);
              return style.color.includes('oklch') || style.backgroundColor.includes('oklch');
            },
            onclone: (clonedDoc) => {
              // Limpiar estilos problemáticos en el documento clonado
              const elements = clonedDoc.querySelectorAll('*');
              elements.forEach(el => {
                const style = el.style;
                // Reemplazar colores oklch con colores estándar
                if (style.color && style.color.includes('oklch')) {
                  style.color = '#000000';
                }
                if (style.backgroundColor && style.backgroundColor.includes('oklch')) {
                  style.backgroundColor = '#ffffff';
                }
              });
            }
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;
          
          // Agregar título
          pdf.setFontSize(16);
          pdf.setFont(undefined, 'bold');
          pdf.text(document.name || 'Documento', 20, 20);
          position = 30;
          
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          
          pdf.save(`${document.name || 'documento'}.pdf`);
        } catch {
          // Si html2canvas falla, usar el método de texto plano
          const pdf = new jsPDF();
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 20;
          const maxWidth = pageWidth - (margin * 2);
          
          // Título del documento
          pdf.setFontSize(16);
          pdf.setFont(undefined, 'bold');
          pdf.text(document.name || 'Documento', margin, margin + 10);
          
          // Contenido del documento (extraer texto del elemento o usar el contenido cargado)
          let textContent = '';
          if (contentElement) {
            textContent = contentElement.textContent || contentElement.innerText || '';
          }
          
          // Si no hay texto del elemento o está vacío, usar el documentContent
          if (!textContent || textContent.trim() === '' || textContent === 'Cargando contenido...') {
            textContent = documentContent;
            
            // Para archivos Markdown, convertir a texto plano sin sintaxis Markdown
            if (isMarkdownFile) {
              textContent = convertMarkdownToPlainText(textContent);
            }
          }
          
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          
          const lines = pdf.splitTextToSize(textContent, maxWidth);
          let yPosition = margin + 30;
          
          lines.forEach((line) => {
            if (yPosition > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += 5;
          });
          
          pdf.save(`${document.name || 'documento'}.pdf`);
        }
      }
    } catch (err) {
      console.error('Error al descargar documento:', err);
      setError('Error al descargar el documento');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = () => {
    if (document?.type === 'pdf') {
      return <PdfIcon className="file-type-icon" style={{ fontSize: '2rem' }} />;
    }
    return <DocIcon className="file-type-icon" style={{ fontSize: '2rem' }} />;
  };

  const renderMarkdownContent = (content) => {
    if (!content) return '';
    
    // Configurar marked para un renderizado seguro
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false // Para permitir HTML básico
    });
    
    return marked(content);
  };

  const isMarkdownFile = document?.fileType === 'text/markdown' || 
                        document?.fileName?.endsWith('.md') || 
                        document?.name?.endsWith('.md') ||
                        (documentContent && (documentContent.includes('#') || documentContent.includes('**') || documentContent.includes('*'))) || // Detectar contenido markdown
                        document?.type === 'markdown' ||
                        (document?.name && document.name.includes('.md'));

  if (!isOpen || !document) return null;

  return (
    <div className="upload-modal document-modal" style={{ zIndex: 1000 }}>
      <div className="upload-modal-content" style={{ maxWidth: '800px', maxHeight: '80vh' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {getFileIcon()}
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{document.name}</h3>
              <p style={{ 
                margin: '0.25rem 0 0 0', 
                fontSize: '0.875rem', 
                color: 'var(--text-color-secondary)' 
              }}>
                Proyecto: {document.projectName} • Tipo: {document.documentType}
              </p>
            </div>
          </div>
          <button 
            className="icon-button" 
            onClick={onClose}
            style={{ padding: '0.5rem' }}
          >
            <CloseIcon className="icon" />
          </button>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {!isEditing ? (
              <>
                <button 
                  className="upload-button" 
                  onClick={() => setIsEditing(true)}
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="upload-button" 
                  onClick={handleDownload}
                  disabled={loading || !documentContent || documentContent === 'Cargando contenido...' || documentContent === 'Error al cargar el documento'}
                  style={{ 
                    fontSize: '0.875rem', 
                    padding: '0.5rem 1rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    opacity: (loading || !documentContent || documentContent === 'Cargando contenido...' || documentContent === 'Error al cargar el documento') ? 0.6 : 1
                  }}
                >
                  📥 Descargar
                </button>
                <button 
                  className="cancel-button" 
                  onClick={handleDelete}
                  style={{ 
                    fontSize: '0.875rem', 
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </>
            ) : (
              <>
                <button 
                  className="upload-button" 
                  onClick={handleSave}
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  💾 Guardar
                </button>
                <button 
                  className="cancel-button" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(documentContent);
                  }}
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  ❌ Cancelar
                </button>
              </>
            )}
          </div>
          
          {/* Vista toggle solo para archivos markdown y cuando no se está editando */}
          {isMarkdownFile && !isEditing && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                onClick={() => setViewMode('rendered')}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  backgroundColor: viewMode === 'rendered' ? '#007bff' : '#e9ecef',
                  color: viewMode === 'rendered' ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📄 Vista
              </button>
              <button
                onClick={() => setViewMode('raw')}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  backgroundColor: viewMode === 'raw' ? '#007bff' : '#e9ecef',
                  color: viewMode === 'raw' ? 'white' : '#495057',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🔤 Código
              </button>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {/* Content */}
        <div style={{ 
          border: '1px solid var(--border-color)', 
          borderRadius: '4px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {loading ? (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
              Cargando contenido...
            </div>
          ) : isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{
                width: '100%',
                height: '400px',
                border: 'none',
                padding: '1rem',
                resize: 'none',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}
              placeholder="Contenido del documento..."
            />
          ) : isMarkdownFile && viewMode === 'rendered' ? (
            // Vista renderizada para archivos markdown
            <div 
              className="markdown-content document-content"
              style={{ 
                padding: '1.5rem',
                background: '#ffffff'
              }}
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdownContent(documentContent) 
              }}
            />
          ) : (
            // Vista de código/texto plano
            <div 
              className="document-content"
              style={{ 
                padding: '1rem',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                background: '#f8f9fa'
              }}
            >
              {documentContent}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-color-secondary)',
          textAlign: 'center'
        }}>
          {document.createdAt && (
            <p style={{ margin: 0 }}>
              Creado: {new Date(document.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;