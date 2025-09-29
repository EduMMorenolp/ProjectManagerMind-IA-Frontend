import React, { useState } from 'react';
import { extractClientInfo, updateClientInfo, saveClientInfo } from '../../../../services/aiService';

const ClienteSection = ({ clientInfo, setClientInfo, projectId, setProjectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Debug: Log projectId changes
  React.useEffect(() => {
    console.log('ClienteSection - projectId changed:', projectId);
  }, [projectId]);

  // Debug: Log clientInfo changes
  React.useEffect(() => {
    console.log('ClienteSection - clientInfo updated:', JSON.stringify(clientInfo, null, 2));
  }, [clientInfo]);

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

      // Add project info to form data
      const projectName = clientInfo.name || 'Proyecto Cliente';
      formData.append('projectName', projectName);
      if (projectId) {
        formData.append('projectId', projectId);
        console.log('Adding projectId to FormData:', projectId);
      } else {
        console.log('No projectId available, will create new project');
      }

      const response = await extractClientInfo(formData);
      
      console.log('=== EXTRACT CLIENT INFO RESPONSE ===');
      console.log('Response:', response);
      console.log('Response success:', response.success);
      console.log('Response clientInfo:', response.clientInfo);
      
      if (response.success && response.clientInfo) {
        console.log('Updating clientInfo with:', response.clientInfo);
        console.log('Previous clientInfo:', clientInfo);
        
        // Actualizar el formulario con la información extraída
        setClientInfo(prevInfo => ({
          ...prevInfo,
          ...response.clientInfo
        }));
        
        // Guardar el ID del proyecto si se proporciona
        if (response.projectId && setProjectId) {
          setProjectId(response.projectId);
        }
        
        setUploadSuccess('Información del cliente extraída y guardada exitosamente');
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

  const handleUpdateClientInfo = async () => {
    if (!projectId) {
      setUploadError('No hay un proyecto asociado. Primero carga un documento o crea un proyecto.');
      return;
    }

    setIsUpdating(true);
    setUploadError('');
    setUpdateSuccess('');

    try {
      const response = await updateClientInfo(projectId, clientInfo);
      
      if (response.success) {
        setUpdateSuccess('Información del cliente actualizada exitosamente');
      } else {
        setUploadError('No se pudo actualizar la información del cliente');
      }
    } catch (error) {
      console.error('Error al actualizar información del cliente:', error);
      setUploadError('Error al actualizar la información del cliente. Por favor, inténtalo nuevamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveClientInfo = async () => {
    setIsSaving(true);
    setUploadError('');
    setSaveSuccess('');

    try {
      const projectName = clientInfo.name || 'Proyecto Cliente';
      const response = await saveClientInfo(clientInfo, projectName, projectId);
      
      if (response.success) {
        // Guardar el ID del proyecto si se proporciona
        if (response.projectId && setProjectId) {
          setProjectId(response.projectId);
        }
        setSaveSuccess('Información del cliente guardada exitosamente en la base de datos');
      } else {
        setUploadError('No se pudo guardar la información del cliente');
      }
    } catch (error) {
      console.error('Error al guardar información del cliente:', error);
      setUploadError('Error al guardar la información del cliente. Por favor, inténtalo nuevamente.');
    } finally {
      setIsSaving(false);
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

          {updateSuccess && (
            <div className="upload-success">
              ✅ {updateSuccess}
            </div>
          )}

          {saveSuccess && (
            <div className="upload-success">
              ✅ {saveSuccess}
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

        {/* Botones para guardar y actualizar información del cliente */}
        <div className="form-actions">
          <div className="button-row">
            <button 
              type="button" 
              className="save-client-button"
              onClick={handleSaveClientInfo}
              disabled={isSaving}
            >
              {isSaving ? '🔄 Guardando...' : '💾 Guardar Información de Cliente'}
            </button>
            
            <button 
              type="button" 
              className="update-client-button"
              onClick={handleUpdateClientInfo}
              disabled={isUpdating || !projectId}
            >
              {isUpdating ? '🔄 Actualizando...' : '✏️ Actualizar Datos del Cliente'}
            </button>
          </div>
          
          <div className="help-texts">
            <p className="help-text">
              💾 <strong>Guardar:</strong> Crea el documento base en la base de datos
            </p>
            <p className="help-text">
              ✏️ <strong>Actualizar:</strong> Modifica el documento existente (requiere proyecto creado)
            </p>
            {!projectId && (
              <p className="help-text warning">
                ⚠️ No hay proyecto asociado. Usa "Guardar" para crear uno nuevo o carga un documento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteSection;