import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocuments, processDocuments, workflowDocuments } from '../../../services';
import DocumentTypeSelector from '../../ui/Form/DocumentTypeSelector';

const Upload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [metadata, setMetadata] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [workflowMode, setWorkflowMode] = useState(false);

  const handleStageChange = useCallback((stage) => {
    setSelectedStage(stage);
  }, []);

  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Por favor, selecciona al menos un archivo para subir.');
      return;
    }
    
    if (!projectName.trim()) {
      setError('El nombre del proyecto es obligatorio.');
      return;
    }
    
    if (!selectedStage) {
      setError('Por favor, selecciona una etapa del proyecto.');
      return;
    }
    
    if (!selectedType) {
      setError('Por favor, selecciona un tipo de documento.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      if (workflowMode) {
        // Flujo completo (subir + procesar)
        const formData = new FormData();
        
        files.forEach(file => {
          formData.append('documents', file);
        });
        
        formData.append('projectName', projectName);
        formData.append('stage', selectedStage);
        formData.append('documentType', selectedType);
        
        if (metadata.trim()) {
          formData.append('metadata', metadata);
        }
        
        const response = await workflowDocuments(formData);
        
        if (response.success) {
          setMessage('Flujo completo ejecutado exitosamente.');
          setTimeout(() => {
            navigate('/projects');
          }, 2000);
        }
      } else {
        // Subir archivos primero
        const formData = new FormData();
        
        files.forEach(file => {
          formData.append('documents', file);
        });
        
        formData.append('projectName', projectName);
        formData.append('stage', selectedStage);
        formData.append('documentType', selectedType);
        
        const uploadResponse = await uploadDocuments(formData);
        
        if (uploadResponse.success) {
          // Luego procesarlos
          const processResponse = await processDocuments({
            projectName,
            stage: selectedStage,
            documentType: selectedType,
            metadata: metadata.trim() ? JSON.parse(metadata) : undefined
          });
          
          if (processResponse.success) {
            setMessage('Documentos subidos y procesados exitosamente.');
            setTimeout(() => {
              navigate('/projects');
            }, 2000);
          }
        }
      }
    } catch (err) {
      console.error('Error en el proceso de subida/procesamiento:', err);
      setError(err.response?.data?.message || 'Error al procesar los documentos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Subir Documentos</h1>
      
      <div className="form-container">
        <div className="workflow-toggle">
          <label className="form-label">Modo de operación:</label>
          <div className="toggle-options">
            <button 
              type="button" 
              className={`toggle-btn ${!workflowMode ? 'active' : ''}`}
              onClick={() => setWorkflowMode(false)}
            >
              Paso a paso
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${workflowMode ? 'active' : ''}`}
              onClick={() => setWorkflowMode(true)}
            >
              Flujo completo
            </button>
          </div>
          <p className="workflow-description">
            {workflowMode 
              ? 'El flujo completo sube y procesa los documentos en una sola operación.' 
              : 'El modo paso a paso sube los archivos y luego los procesa.'}
          </p>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {message && (
          <div className="success-message">
            <p>{message}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName" className="form-label">Nombre del Proyecto:</label>
            <input
              type="text"
              id="projectName"
              className="form-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ingresa el nombre del proyecto"
              required
            />
          </div>
          
          <DocumentTypeSelector
            selectedStage={selectedStage}
            selectedType={selectedType}
            onStageChange={handleStageChange}
            onTypeChange={handleTypeChange}
            disabled={loading}
          />
          
          <div className="form-group">
            <label htmlFor="metadata" className="form-label">Metadatos (opcional, formato JSON):</label>
            <textarea
              id="metadata"
              className="form-input"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{"cliente": "Empresa XYZ", "prioridad": "alta"}'
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Archivos:</label>
            <div className="file-upload">
              <input
                type="file"
                id="documents"
                className="file-upload-input"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.docx,.doc"
              />
              <label htmlFor="documents">
                {files.length > 0 
                  ? `${files.length} archivo(s) seleccionado(s)` 
                  : 'Arrastra archivos aquí o haz clic para seleccionar'}
              </label>
              
              {files.length > 0 && (
                <div className="selected-files">
                  <p>Archivos seleccionados:</p>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Procesando...' : workflowMode ? 'Subir y Procesar' : 'Subir Documentos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;