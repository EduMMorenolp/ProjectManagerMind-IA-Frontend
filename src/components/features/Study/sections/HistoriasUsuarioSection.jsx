import React, { useState, useEffect } from 'react';
import { PlayIcon, EditIcon, CheckIcon, XIcon, PlusIcon, TrashIcon, ClockIcon } from '../../../ui/Icons';
import { generateHistoriasUsuario } from '../../../../services/aiService';
import { getDocumentsByProject } from '../../../../services/documentService';

const HistoriasUsuarioSection = ({ projectId, processing, setProcessing }) => {
  const [configuracion, setConfiguracion] = useState({
    roles: ['Usuario Final', 'Administrador del Sistema', 'Cliente'],
    epicas: ['Gestión de Usuarios', 'Funcionalidades Core', 'Reportes'],
    nivelDetalle: 'intermedio',
    industry: 'Software',
    documentIds: []
  });
  
  const [historias, setHistorias] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [documentosDisponibles, setDocumentosDisponibles] = useState([]);
  const [historiaEditando, setHistoriaEditando] = useState(null);
  const [filtros, setFiltros] = useState({
    prioridad: 'todas',
    epica: 'todas',
    rol: 'todos'
  });

  // Cargar documentos disponibles al montar el componente
  useEffect(() => {
    const cargarDocumentosDisponibles = async () => {
      try {
        const docs = await getDocumentsByProject(projectId);
        const documentosObjetivos = docs.filter(doc => 
          ['OBJETIVOS', 'RELEVAMIENTO', 'CLIENTE'].includes(doc.documentType)
        );
        setDocumentosDisponibles(documentosObjetivos);
      } catch (error) {
        console.error('Error cargando documentos:', error);
      }
    };

    if (projectId) {
      cargarDocumentosDisponibles();
    }
  }, [projectId]);

  const handleGenerateHistorias = async () => {
    if (!projectId) {
      alert('No hay proyecto seleccionado');
      return;
    }

    setProcessing(true);
    try {
      console.log('🚀 Generando historias de usuario...');
      const resultado = await generateHistoriasUsuario(projectId, configuracion);
      
      if (resultado.success) {
        setHistorias(resultado.data.historias || []);
        setResumen(resultado.data.resumen || null);
        console.log('✅ Historias generadas exitosamente');
      } else {
        throw new Error(resultado.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error generando historias:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const agregarRol = () => {
    const nuevoRol = prompt('Nombre del nuevo rol:');
    if (nuevoRol && !configuracion.roles.includes(nuevoRol)) {
      setConfiguracion(prev => ({
        ...prev,
        roles: [...prev.roles, nuevoRol]
      }));
    }
  };

  const eliminarRol = (rol) => {
    setConfiguracion(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r !== rol)
    }));
  };

  const agregarEpica = () => {
    const nuevaEpica = prompt('Nombre de la nueva épica:');
    if (nuevaEpica && !configuracion.epicas.includes(nuevaEpica)) {
      setConfiguracion(prev => ({
        ...prev,
        epicas: [...prev.epicas, nuevaEpica]
      }));
    }
  };

  const eliminarEpica = (epica) => {
    setConfiguracion(prev => ({
      ...prev,
      epicas: prev.epicas.filter(e => e !== epica)
    }));
  };

  const editarHistoria = (historia) => {
    setHistoriaEditando({ ...historia });
  };

  const guardarEdicion = () => {
    setHistorias(prev => 
      prev.map(h => h.id === historiaEditando.id ? historiaEditando : h)
    );
    setHistoriaEditando(null);
  };

  const cancelarEdicion = () => {
    setHistoriaEditando(null);
  };

  const historiasFilterdas = historias.filter(historia => {
    return (filtros.prioridad === 'todas' || historia.prioridad === filtros.prioridad) &&
           (filtros.epica === 'todas' || historia.epica === filtros.epica) &&
           (filtros.rol === 'todos' || historia.rol === filtros.rol);
  });

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'Alta': return '#dc2626';
      case 'Media': return '#d97706';
      case 'Baja': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getStoryPointsColor = (points) => {
    if (points <= 2) return '#16a34a';
    if (points <= 5) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <h3>📖 Historias de Usuario</h3>
        <p className="section-description">Genera historias de usuario desde objetivos del proyecto</p>
      </div>
      
      <div className="historias-usuario-content">
        {/* Configuración */}
        <div className="configuration-panel">
          <button 
            className="config-toggle-button"
            onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
          >
            ⚙️ Configuración {mostrarConfiguracion ? '▼' : '▶'}
          </button>

          {mostrarConfiguracion && (
            <div className="config-expanded">
              {/* Documentos a usar */}
              <div className="config-section">
                <h4>📄 Documentos de Objetivos</h4>
                {documentosDisponibles.length > 0 ? (
                  documentosDisponibles.map(doc => (
                    <label key={doc.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={configuracion.documentIds.includes(doc.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfiguracion(prev => ({
                              ...prev,
                              documentIds: [...prev.documentIds, doc.id]
                            }));
                          } else {
                            setConfiguracion(prev => ({
                              ...prev,
                              documentIds: prev.documentIds.filter(id => id !== doc.id)
                            }));
                          }
                        }}
                      />
                      {doc.name} ({doc.documentType})
                    </label>
                  ))
                ) : (
                  <p className="no-documents">No hay documentos de objetivos disponibles</p>
                )}
              </div>

              {/* Roles */}
              <div className="config-section">
                <h4>👥 Roles del Sistema</h4>
                <div className="tags-container">
                  {configuracion.roles.map(rol => (
                    <span key={rol} className="config-tag">
                      {rol}
                      <button onClick={() => eliminarRol(rol)}>
                        <XIcon className="tag-remove-icon" />
                      </button>
                    </span>
                  ))}
                  <button className="add-tag-button" onClick={agregarRol}>
                    <PlusIcon className="button-icon" />
                    Agregar Rol
                  </button>
                </div>
              </div>

              {/* Épicas */}
              <div className="config-section">
                <h4>🎯 Épicas del Proyecto</h4>
                <div className="tags-container">
                  {configuracion.epicas.map(epica => (
                    <span key={epica} className="config-tag">
                      {epica}
                      <button onClick={() => eliminarEpica(epica)}>
                        <XIcon className="tag-remove-icon" />
                      </button>
                    </span>
                  ))}
                  <button className="add-tag-button" onClick={agregarEpica}>
                    <PlusIcon className="button-icon" />
                    Agregar Épica
                  </button>
                </div>
              </div>

              {/* Nivel de detalle */}
              <div className="config-section">
                <h4>📊 Nivel de Detalle</h4>
                <select 
                  value={configuracion.nivelDetalle}
                  onChange={(e) => setConfiguracion(prev => ({
                    ...prev,
                    nivelDetalle: e.target.value
                  }))}
                  className="detail-level-select"
                >
                  <option value="basico">Básico - Historias simples</option>
                  <option value="intermedio">Intermedio - Criterios de aceptación</option>
                  <option value="detallado">Detallado - Análisis completo</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Botón de generación */}
        <div className="generate-section">
          <button 
            className="generate-button primary"
            onClick={handleGenerateHistorias}
            disabled={processing || !projectId}
          >
            {processing ? (
              <>
                <ClockIcon className="button-icon spinning" />
                Generando Historias...
              </>
            ) : (
              <>
                <PlayIcon className="button-icon" />
                Generar Historias de Usuario
              </>
            )}
          </button>
        </div>

        {/* Resumen de resultados */}
        {resumen && (
          <div className="results-summary">
            <h4>📊 Resumen de Generación</h4>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{resumen.totalHistorias || 0}</span>
                <span className="stat-label">Historias Generadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{resumen.totalStoryPoints || 0}</span>
                <span className="stat-label">Story Points Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{resumen.sprintsEstimados || 0}</span>
                <span className="stat-label">Sprints Estimados</span>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        {historias.length > 0 && (
          <div className="filters-section">
            <h4>🔍 Filtros</h4>
            <div className="filters-container">
              <select 
                value={filtros.prioridad}
                onChange={(e) => setFiltros(prev => ({ ...prev, prioridad: e.target.value }))}
              >
                <option value="todas">Todas las prioridades</option>
                <option value="Alta">Alta prioridad</option>
                <option value="Media">Media prioridad</option>
                <option value="Baja">Baja prioridad</option>
              </select>

              <select 
                value={filtros.epica}
                onChange={(e) => setFiltros(prev => ({ ...prev, epica: e.target.value }))}
              >
                <option value="todas">Todas las épicas</option>
                {configuracion.epicas.map(epica => (
                  <option key={epica} value={epica}>{epica}</option>
                ))}
              </select>

              <select 
                value={filtros.rol}
                onChange={(e) => setFiltros(prev => ({ ...prev, rol: e.target.value }))}
              >
                <option value="todos">Todos los roles</option>
                {configuracion.roles.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Lista de historias generadas */}
        {historiasFilterdas.length > 0 && (
          <div className="historias-list">
            <h4>📝 Historias de Usuario Generadas</h4>
            {historiasFilterdas.map(historia => (
              <div key={historia.id} className="historia-card">
                {historiaEditando && historiaEditando.id === historia.id ? (
                  // Modo edición
                  <div className="historia-edit-mode">
                    <div className="edit-header">
                      <input
                        type="text"
                        value={historiaEditando.titulo}
                        onChange={(e) => setHistoriaEditando(prev => ({
                          ...prev,
                          titulo: e.target.value
                        }))}
                        className="edit-title-input"
                      />
                      <div className="edit-actions">
                        <button onClick={guardarEdicion} className="save-button">
                          <CheckIcon />
                        </button>
                        <button onClick={cancelarEdicion} className="cancel-button">
                          <XIcon />
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      value={historiaEditando.historia}
                      onChange={(e) => setHistoriaEditando(prev => ({
                        ...prev,
                        historia: e.target.value
                      }))}
                      className="edit-historia-textarea"
                      rows="3"
                    />
                  </div>
                ) : (
                  // Modo vista
                  <div className="historia-view-mode">
                    <div className="historia-header">
                      <div className="historia-title">
                        <span className="historia-id">{historia.id}</span>
                        <h5>{historia.titulo}</h5>
                      </div>
                      <div className="historia-badges">
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPrioridadColor(historia.prioridad) }}
                        >
                          {historia.prioridad}
                        </span>
                        <span 
                          className="story-points-badge"
                          style={{ backgroundColor: getStoryPointsColor(historia.storyPoints) }}
                        >
                          {historia.storyPoints} pts
                        </span>
                        <span className="epica-badge">
                          {historia.epica}
                        </span>
                      </div>
                      <button 
                        onClick={() => editarHistoria(historia)}
                        className="edit-historia-button"
                      >
                        <EditIcon />
                      </button>
                    </div>

                    <div className="historia-content">
                      <p className="historia-text">
                        <strong>Como</strong> {historia.rol} <strong>quiero</strong> {historia.funcionalidad} <strong>para</strong> {historia.beneficio}
                      </p>

                      {historia.criteriosAceptacion && historia.criteriosAceptacion.length > 0 && (
                        <div className="criterios-aceptacion">
                          <h6>✅ Criterios de Aceptación:</h6>
                          <ul>
                            {historia.criteriosAceptacion.map((criterio, index) => (
                              <li key={index}>
                                <strong>{criterio.criterio}</strong>
                                {criterio.condiciones && criterio.condiciones.length > 0 && (
                                  <ul className="condiciones-list">
                                    {criterio.condiciones.map((condicion, idx) => (
                                      <li key={idx}>{condicion}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {historia.dependencias && historia.dependencias.length > 0 && (
                        <div className="dependencias">
                          <h6>🔗 Dependencias:</h6>
                          <div className="dependencias-list">
                            {historia.dependencias.map((dep, index) => (
                              <span key={index} className="dependencia-tag">{dep}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {historia.notas && (
                        <div className="historia-notas">
                          <h6>📋 Notas:</h6>
                          <p>{historia.notas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {historias.length === 0 && !processing && (
          <div className="no-historias">
            <p>No hay historias de usuario generadas aún.</p>
            <p>Configura los parámetros y genera historias desde los documentos de objetivos del proyecto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoriasUsuarioSection;