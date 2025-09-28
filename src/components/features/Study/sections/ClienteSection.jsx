import React, { useState } from 'react';
import { extractClientInfo } from '../../../../services/aiService';

const ClienteSection = ({ clientInfo, setClientInfo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsLoading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });

      const response = await extractClientInfo(formData);
      
      if (response.success && response.clientInfo) {
        // Actualizar el formulario con la información extraída
        setClientInfo(prevInfo => ({
          ...prevInfo,
          ...response.clientInfo
        }));
        setUploadSuccess('Información del cliente extraída exitosamente del documento');
      } else {
        setUploadError('No se pudo extraer información del cliente del documento');
      }
    } catch (error) {
      console.error('Error al procesar documento:', error);
      setUploadError('Error al procesar el documento. Por favor, inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
      // Limpiar el input de archivo
      event.target.value = '';
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h3>👤 Información del Cliente</h3>
        <p className="section-description">Ingresa los datos del cliente y sus requerimientos</p>
        
        {/* Botón para cargar documento */}
        <div className="document-upload-section">
          <div className="upload-button-container">
            <label htmlFor="client-document-upload" className="upload-button">
              📄 Cargar Documento del Cliente
            </label>
            <input
              id="client-document-upload"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              disabled={isLoading}
              style={{ display: 'none' }}
              multiple
            />
            <span className="upload-help-text">
              {isLoading ? 'Procesando documento...' : 'Sube un documento para rellenar automáticamente el formulario'}
            </span>
          </div>
          
          {uploadError && (
            <div className="upload-error">
              ⚠️ {uploadError}
            </div>
          )}
          
          {uploadSuccess && (
            <div className="upload-success">
              ✅ {uploadSuccess}
            </div>
          )}
        </div>
      </div>
      
      <div className="client-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nombre del Cliente/Empresa</label>
            <input 
              type="text" 
              placeholder="Ej: Clínica Seprise"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Tipo de Negocio</label>
            <input 
              type="text" 
              placeholder="Ej: Servicios de salud, consultorio médico"
              value={clientInfo.business}
              onChange={(e) => setClientInfo({...clientInfo, business: e.target.value})}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Descripción de la Empresa</label>
          <textarea 
            placeholder="¿Qué hace la empresa? ¿Cuál es su actividad principal?"
            rows="3"
            value={clientInfo.description}
            onChange={(e) => setClientInfo({...clientInfo, description: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Historia y Contexto</label>
          <textarea 
            placeholder="Historia de la empresa, situación actual, problemas identificados..."
            rows="4"
            value={clientInfo.history}
            onChange={(e) => setClientInfo({...clientInfo, history: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>¿Qué Necesita/Quiere el Cliente?</label>
          <textarea 
            placeholder="Requerimientos, necesidades específicas, objetivos que busca cumplir..."
            rows="4"
            value={clientInfo.needs}
            onChange={(e) => setClientInfo({...clientInfo, needs: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default ClienteSection;