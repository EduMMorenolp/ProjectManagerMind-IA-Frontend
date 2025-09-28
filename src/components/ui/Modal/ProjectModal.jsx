import React, { useState } from 'react';
import '../../../styles/upload-modal.css';

const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onProjectCreated(formData);
      setFormData({ name: '', description: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal">
      <div className="upload-modal-content">
        <h3>Crear Nuevo Proyecto</h3>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Análisis de Documentos Q1 2024"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el propósito de este proyecto..."
              rows={3}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                resize: 'vertical'
              }}
              disabled={loading}
            />
          </div>

          <div className="upload-modal-actions">
            <button 
              type="button"
              className="cancel-button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="upload-button"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;